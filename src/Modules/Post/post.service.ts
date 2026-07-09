import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/response/error.response";
import { decrypt } from "../../Utils/security/encryption";
import { PostRepository } from "../../DB/repositories/post.repo";
import { PostModel } from "../../DB/Models/post.model";
import { CreatePostDTO, ReactParamsPostDTO, ReactQueryPostDTO } from "./post.DTO";
import { UserRepository } from "../../DB/repositories/user.repo";
import { HUserDocument, UserModel } from "../../DB/Models/user.model";
import { NotificationService } from "../../Utils/services/notification.service";
import { Types } from "mongoose";
import { getFCMs } from "../../DB/redis.repository";
import { AvailabitlityEnum } from "../../Utils/enums/auth.enum";

export const getAvailability = (user : HUserDocument) => {
  return [
    {availability : AvailabitlityEnum.PUBLIC },
    {availability : AvailabitlityEnum.ONLY_ME , createdBy : user._id},
    {tags : {$in : [ user._id ]}}    
  ]
}


class PostService {
        private readonly _userRepo = new UserRepository(UserModel)
        private readonly _postRepo = new PostRepository(PostModel)
        private readonly _notificationService : NotificationService
    
        constructor(){
          this._notificationService = new NotificationService()
        }
    
        // task 1 kist app posts paginated

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

        // add types of react (like, love, haha, wow, sad, angry) to the post
       reactPost = async (req: Request, res: Response): Promise<Response> => {

          const { postId }  = req.params
          const { react }  = req.query

          const post = await this._postRepo.findOneAndUpdate({
            filter : {
              _id : postId,
              $or : getAvailability(req.user)

            },
            update : {
              ...(Number(react)  > 0 ? 
              {$addToSet : {likes : req.user._id}}
               : {$pull : {likes :req.user._id}})
            }
          })

          if(!post){
            throw new NotFoundException("Fail to found matching post")
          }


          return successResponse({
            res ,
            statusCode : 200,
            data : post
          })

}

      async getPosts(user : HUserDocument){
        const posts = await this._postRepo.find({
          filter : {
            $or : getAvailability(user)
          },
          options : {
            populate : [{path:"createdBy" } , {path : "comments"}]
          }
        })

        return posts
      }
      

}



export default new PostService()