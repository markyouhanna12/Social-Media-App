import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import {signupDTOBody } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import { BadRequestException } from "../../Utils/response/error.response";

class AuthenticationService {

    constructor(){}

    signup = (req: Request , res : Response) : Response =>{

      const {username , email , password , confirmPassword } : signupDTOBody = req.body

      // TODO: Validate the data
      try {

        signupSchema.body.parse({username , email , password , confirmPassword})
        
      } catch (error) {

        throw new BadRequestException("Invalid data", {cause : error})
        
      }

      return successResponse({
        res , 
        statusCode: 200 , 
        message:"User created successfully" , 
        data : {username , email , password , confirmPassword}
      })
    }
    

}

export default new AuthenticationService