import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import {signupDTOBody } from "./auth.DTO";
import { signupSchema } from "./auth.validation";
import { BadRequestException } from "../../Utils/response/error.response";

class AuthenticationService {

    constructor(){}

    signup = (req: Request , res : Response) : Response =>{

      const {username , email , password} : signupDTOBody = req.body

  
      return successResponse({
        res , 
        statusCode: 200 , 
        message:"User created successfully" , 
        data : {username , email , password }
      })
    }
    

}

export default new AuthenticationService