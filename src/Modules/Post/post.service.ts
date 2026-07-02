import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response";
import { decrypt } from "../../Utils/security/encryption";
import { PostRepository } from "../../DB/repositories/post.repo";
import { PostModel } from "../../DB/Models/post.model";
import { CreatePostDTO } from "./post.DTO";
import { UserRepository } from "../../DB/repositories/user.repo";
import { UserModel } from "../../DB/Models/user.model";
import { NotificationService } from "../../Utils/services/notification.service";
import { Types } from "mongoose";
import { getFCMs } from "../../DB/redis.repository";


class PostService {
        private readonly _userRepo = new UserRepository(UserModel)
        private readonly _postRepo = new PostRepository(PostModel)
        private readonly _notificationService : NotificationService
    
        constructor(){
          this._notificationService = new NotificationService()
        }
    
        createPost = async (req: Request, res: Response) : Promise<Response> => {

           const {content , availability , tags = []} : CreatePostDTO = req.body

           const taggedUser = tags.length ? await this._userRepo.find({
            filter :{
              _id: {$in: tags},
            
            },
            select : "firstName lastName email"

           }) : []

           if(taggedUser.length !== tags.length){
            throw new BadRequestException("Failed to find some tagged users")
           }
           
           const tagged = taggedUser.map((user) => user._id as Types.ObjectId)


           const tokensResults = await Promise.all(
            tags.map((tag : string) => getFCMs(tag))
           )

           const FCM_Tokens = [
            ... new Set(tokensResults.flat().filter((token) : token is string => Boolean(token)))
           ]

           const posts = await this._postRepo.create({
            data : [{
              content ,
              availability,
              tags : tagged,
              createdBy : req.user._id
            }]
           })

           if(FCM_Tokens.length){
            await this._notificationService.sendNotifications({
              tokens : FCM_Tokens,
              data : {
                title : "Post Mention",
                body : JSON.stringify({
                  message : `${req.user.username} mentioned you in a post `,
                  post : posts?.[0]?._id
                })
              }
            })
          }

           const populatedPosts = await posts?.[0]?.populate([
            {path : "createdBy" , select : "firstName lastName email"},
            {path : "tags" , select : "firstName lastName email"}
           ])  


          return successResponse({
            res,
            statusCode : 201,
            message : "Post created successfully",
            data : populatedPosts
          })
           
}


}



export default new PostService()