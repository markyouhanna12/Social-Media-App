import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { signupDTO } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import { BadRequestException } from "../../Utils/response/error.response";
import { HUserDocument, UserModel } from "../../DB/Models/user.model";

class AuthenticationService {

    constructor(){}

    signup = async (req: Request , res : Response) : Promise<Response> =>{

      const {username , email , password , gender , role} : signupDTO = req.body

      const user : HUserDocument = await new UserModel({
        username,
        email,
        password,
        gender,
        role
      })
      await user.save()

  
      return successResponse({
        res , 
        statusCode: 200 , 
        message:"User created successfully" , 
        data : { user }
      })
    }
    

}

export default new AuthenticationService