import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { confirmEmailDTO, loginDTO, signupDTO } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response";
import { HUserDocument, UserModel } from "../../DB/Models/user.model";
import { UserRepository } from "../../DB/repositories/user.repo";
import { compareHash, genrateHash } from "../../Utils/security/hash";
import { encrypt } from "../../Utils/security/encryption";
import { generateOTP } from "../../Utils/generateOTP";
import { emailEvents } from "../../Utils/events/email.event";
import { TokenService } from "../../Utils/services/token";
import { LogoutTypeEnum, ProviderEnum } from "../../Utils/enums/auth.enum";
import { addFCM, getFCMs, revokeTokenKey, set, ttl } from "../../DB/redis.repository";
import { ACCESS_EXPIRES, Client_ID } from "../../config/config.service";
import {OAuth2Client} from "google-auth-library"
import { notification } from "../../Utils/services/notification.service";

class AuthenticationService {

    private _userRepo = new UserRepository(UserModel)
    private _tokenService : TokenService 

    constructor(){
      this._tokenService = new TokenService()
    }


    signup = async (req: Request , res : Response) : Promise<Response> =>{

      const {username , email , password , phone } : signupDTO = req.body

      const checkUser = await this._userRepo.findOne({
        filter : {email},
        select : "email"
      })

      if(checkUser){
        throw new ConflictException("User already exists")
      }

      const otp = generateOTP()
      
      const user = await this._userRepo.create({
        data: [{
          username,
          email,
          password ,
          phone ,
          confirmEmailOTP : await genrateHash(otp)
          
        }],
        options:{validateBeforeSave:true}
      } )

  
      return successResponse({
        res , 
        statusCode: 200 , 
        message:"User created successfully" , 
        data : { user }
      })
    }

    confirmEmail = async (req: Request , res : Response) : Promise<Response> =>{
      const {email , otp} : confirmEmailDTO = req.body


      const user = await this._userRepo.findOne({
        filter: {
          email,
          confirmEmailOTP: {$exists :true}, confirmEmailAt:{$exists : false}
        }
      })

      if(!user){
        throw new NotFoundException("User Not Found or Already confirmed")
      }

      if(!compareHash(otp , user?.confirmEmailOTP as string)){
        throw new BadRequestException("Invalid OTP")
      }

      await this._userRepo.updateOne({
        filter:{email},
        update:{
          confirmEmailAt : Date.now() ,
          $unset :{confirmEmailOTP : true}
        }
      })

      return successResponse({
        res , 
        statusCode: 200 , 
        message:"Email confirmed successfully"})

  
    }

    login = async (req: Request , res : Response) : Promise<Response> =>{

      const {email , password , FCM} : loginDTO = req.body

      const user = await this._userRepo.findOne({
        filter: {
          email,
          confirmEmailAt: {$exists : true}
        }
      })

      if(!user){
        throw new NotFoundException("User Not Found or Not confirmed")
      }
      if(!await compareHash(password , user.password)){
        throw new BadRequestException("Invalid password")
      }

      if(FCM){
        await addFCM(user._id , FCM)
        const tokens = await getFCMs(user._id)
        console.log(tokens);
        
        if(tokens?.length){
          await notification.sendNotifications({
            tokens,
            data:{title: "Login" , body : `New Login at ${Date.now()}`}
          })
        }
      }

      const credentails = await this._tokenService.getNewLoginCredentials(user as any)
      
      
      return successResponse({
        res , 
        statusCode: 200 , 
        message:"Login successful",
        data: { credentails }
      })
    }

    logoutWithRedis = async (req : Request , res : Response) : Promise<Response> =>{

      const {flag} = req.body

      let status = 200
      switch (flag){
        case LogoutTypeEnum.logout:

          await set({
          key : revokeTokenKey({userId : req.decoded.id , jti : req.decoded.jti }),
          value : req.decoded.jti,
          ttl : Number(ACCESS_EXPIRES)})
          status = 201
          break;
        case LogoutTypeEnum.logoutFromAll:
          
          await this._userRepo.updateOne({
            filter :{_id :req.decoded.id},
            update :{changeCredentialsTime : Date.now()}
          })

          status = 200
          break
      }

      return successResponse({
        res , 
        statusCode : status 
        , message :"Logout successfully"})
    }

     verifyGoogleAccount = async ({idToken} : {idToken: string}) =>{

      const client = new OAuth2Client()
      const ticket = await client.verifyIdToken({
        idToken,
        audience:Client_ID
      })

      const payload = ticket.getPayload()

      return payload;
    }



    loginWithGoogle = async (req: Request, res: Response) : Promise<Response> =>{

    const {idToken} = req.body
    // verify with Google Auth Library
    const {email , picture , given_name , family_name , email_verified } : any = await this.verifyGoogleAccount({idToken})
    

    // logic bussiness
    if(!email_verified){
      throw new BadRequestException("Email not verifed")
    }

    let user = await this._userRepo.findOne({filter:{email}})

    if(user){
      if(user.provider === ProviderEnum.Google){
        const credentails = await this._tokenService.getNewLoginCredentials(user as any)

        return successResponse({
          res , 
          statusCode: 200 , 
          message:"Login successful",
          data: { credentails }
        })
      }
    }

    const newUser = await this._userRepo.create({
      data:[{
        email,
        firstName:given_name,
        lastName:family_name,
        profilePic:picture,
        provider:ProviderEnum.Google
      }]
    })

    const credentails = await this._tokenService.getNewLoginCredentials(newUser as any)

    return successResponse({
      res ,
      statusCode: 201 ,
      message:"User created successfully",
      data: { credentails }
    })

    

}
    

}

export default new AuthenticationService