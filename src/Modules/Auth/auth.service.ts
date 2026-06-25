import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { SignupDTO } from "./auth.DTO";

class AuthenticationService {

    private _username : string = "mark"

    constructor(){}

    signup = (req: Request , res : Response) : Response =>{
      return successResponse({res , statusCode: 200 , message:"Hello From signup"})
    }
    

}

export default new AuthenticationService