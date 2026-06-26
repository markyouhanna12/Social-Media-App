import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { signupDTO } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import { BadRequestException, ConflictException } from "../../Utils/response/error.response";
import { HUserDocument, UserModel } from "../../DB/Models/user.model";
import { UserRepository } from "../../DB/repositories/user.repo";

class AuthenticationService {

    private _userModel = new UserRepository(UserModel)

    constructor(){}

    signup = async (req: Request , res : Response) : Promise<Response> =>{

      const {username , email , password , gender , role} : signupDTO = req.body

      const checkUser = await this._userModel.findOne({
        filter : {email},
        select : "email"
      })

      if(checkUser){
        throw new ConflictException("User already exists")
      }

      const user = await this._userModel.create({
        data: {
          username,
          email,
          password,
          ...(gender && { gender })
        }
      } )
  
      return successResponse({
        res , 
        statusCode: 200 , 
        message:"User created successfully" , 
        data : { user }
      })
    }
    

}

export default new AuthenticationService