import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response";
import { decrypt } from "../../Utils/security/encryption";
import { PostRepository } from "../../DB/repositories/post.repo";
import { PostModel } from "../../DB/Models/post.model";


class PostService {
        private _postRepo = new PostRepository(PostModel)
    
        constructor(){}
    
        createPost = async (req: Request, res: Response) : Promise<Response> => {

          return successResponse({
            res,
            statusCode : 201,
            message : "Post created successfully"
          })
           
        }
      
}



export default new PostService