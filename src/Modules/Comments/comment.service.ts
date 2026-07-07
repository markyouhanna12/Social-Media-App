import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";
import { NotificationService } from "../../Utils/services/notification.service";
import { UserRepository } from "../../DB/repositories/user.repo";
import { PostRepository } from "../../DB/repositories/post.repo";
import { UserModel } from "../../DB/Models/user.model";
import { IPost, PostModel } from "../../DB/Models/post.model";
import { getAvailability } from "../Post/post.service";
import { NotFoundException } from "../../Utils/response/error.response";
import { HydratedDocument, Types } from "mongoose";
import { getFCMs } from "../../DB/redis.repository";
import { CommentRepository } from "../../DB/repositories/comment.repo";
import { CommentModel } from "../../DB/Models/comment.model";

class CommentService {
        private readonly _userRepo = new UserRepository(UserModel)
        private readonly _postRepo = new PostRepository(PostModel)
        private readonly _commentRepo = new CommentRepository(CommentModel)

        private readonly _notificationService : NotificationService




    constructor(){
            this._notificationService = new NotificationService()
        
    }


    createComment = async (req : Request , res : Response ) : Promise<Response> => {


        const {postId} = req.params
        const {tags = [] , content} = req.body

        const post = await this._postRepo.findOne({
            filter : {_id : postId , $or : getAvailability(req.user)}
        })

        if(!post){
            throw new NotFoundException("Fail to find matching post")
        }

        const tagged : Types.ObjectId[] = []
        const FCM_Tokens : string[] = []

        if(tags?.length){
            const taggedAccounts = await this._userRepo.find({
                filter :{
                    _id : {$in : tags}
                }
            })

            if(taggedAccounts.length != tags.length){
                throw new NotFoundException("Fail to find some or all mentioned accounts")
            }
            for(const tag of tags){
                tagged.push(tag)
               const mentions = await getFCMs(tag)
               mentions.map((token : string) => FCM_Tokens.push(token) )

            }

            const [comment] = await this._commentRepo.create({
                data : [
                    {
                    createdBy : req.user._id,
                    content : content as string,
                    postId : post._id,
                    tags : tagged

                }
            ]
            }) || []

            if(FCM_Tokens.length && comment){
            await this._notificationService.sendNotifications({
              tokens : FCM_Tokens,
              data : {
                title : "Post Mention",
                body : JSON.stringify({
                  message : `${req.user.username} mentioned you in a post `,
                  postId : post._id,
                  commentId : comment._id 
                })
              }
            })
          }

        }




        return successResponse({
            res,
            message : "Comment created successfully",
            statusCode : 201
        })

    }


    createReply = async (req : Request , res : Response ) : Promise<Response> => {

        const { postId , commentId } = req.params as {postId : string , commentId : string}

        
        const {tags = [] , content} = req.body

        const comment = await this._commentRepo.findOne({
            filter : {_id : commentId , postId : postId},
            options : {
                populate : [
                    {
                        path : "postId",
                        match : {
                            $or : getAvailability(req.user)
                        }
                    }
                ]
            }
        })

        if(!comment){
            throw new NotFoundException("Fail to find matching comment")
        }

        const mentions : Types.ObjectId[] = []
        const FCM_Tokens : string[] = []

        if(tags?.length){
            const mentionsAccounts = await this._userRepo.find({
                filter :{
                    _id : {$in : tags}
                }
            })

            if(mentionsAccounts.length != tags.length){
                throw new NotFoundException("Fail to find some or all mentioned accounts")
            }
            for(const tag of tags){
                mentions.push(tag)
               const tagged = await getFCMs(tag)
               tagged.map((token : string) => FCM_Tokens.push(token) )

            }

           
            

        }
        const post = comment.postId as HydratedDocument<IPost>

        const [reply] = await this._commentRepo.create({
                data : [
                    {
                    createdBy : req.user._id,
                    content : content as string,
                    postId : post._id,
                    commentId : comment._id,
                    tags : mentions
                }]
            }) || []
        

        if(FCM_Tokens.length && reply){            
            const result = await this._notificationService.sendNotifications({
                tokens : FCM_Tokens ,
                data : {
                    title : "Post Reply",
                    body : JSON.stringify({
                        message : `${req.user.username} replied to you in a post`,
                        postId: post._id,
                        commentId: comment._id,
                        replyId: reply._id,
                    })
                }

            })
        }


        return successResponse({
            res,
            message : "reply created successfully",
            statusCode : 201,
            data : reply
        })

    }
}


export default new CommentService()