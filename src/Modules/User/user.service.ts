import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response";
import { UserRepository } from "../../DB/repositories/user.repo";
import { UserModel } from "../../DB/Models/user.model";
import { decrypt } from "../../Utils/security/encryption";


class UserService {
        private _userRepo = new UserRepository(UserModel)
    
        constructor(){}
    
      getProfile = async (req : Request , res : Response) =>{
        req.user.phone = await decrypt(req.user.phone as string)
        
        return successResponse({res,message:"Done",statusCode:200,data:req.user})
      } 
}



export default new UserService