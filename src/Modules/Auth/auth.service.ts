import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { confirmEmailDTO, signupDTO } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response";
import { HUserDocument, UserModel } from "../../DB/Models/user.model";
import { UserRepository } from "../../DB/repositories/user.repo";
import { compareHash, genrateHash } from "../../Utils/security/hash";
import { encrypt } from "../../Utils/security/encryption";
import { generateOTP } from "../../Utils/generateOTP";
import { emailEvents } from "../../Utils/events/email.event";

class AuthenticationService {

    private _userModel = new UserRepository(UserModel)

    constructor(){}

    signup = async (req: Request , res : Response) : Promise<Response> =>{

      const {username , email , password , phone } : signupDTO = req.body

      const checkUser = await this._userModel.findOne({
        filter : {email},
        select : "email"
      })

      if(checkUser){
        throw new ConflictException("User already exists")
      }

      const otp = generateOTP()
      
      const user = await this._userModel.create({
        data: [{
          username,
          email,
          password: await genrateHash(password) ,
          phone : await encrypt(phone),
          confirmEmailOTP : await genrateHash(otp)
          
        }],
        options:{validateBeforeSave:true}
      } )

      await emailEvents.emit("confirmEmail" ,{
        to: email,
        username ,
        otp
      
      })
  
      return successResponse({
        res , 
        statusCode: 200 , 
        message:"User created successfully" , 
        data : { user }
      })
    }

    confirmEmail = async (req: Request , res : Response) : Promise<Response> =>{
      const {email , otp} : confirmEmailDTO = req.body


      const user = await this._userModel.findOne({
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

      await this._userModel.updateOne({
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
    

}

export default new AuthenticationService