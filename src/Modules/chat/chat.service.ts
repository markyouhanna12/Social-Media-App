import { Request, Response } from "express";
import { IGetchatDTO, ISayHiDTO, ISendMessageDTO } from "./chat.dto";
import { successResponse } from "../../Utils/response/success.response";
import { ChatRepository } from "../../DB/repositories/chat.repo";
import { ChatModel } from "../../DB/Models/chat.model";
import { UserRepository } from "../../DB/repositories/user.repo";
import { UserModel } from "../../DB/Models/user.model";
import { Types } from "mongoose";
import { BadRequestException, NotFoundException } from "../../Utils/response/error.response";

export class ChatService {

    private _chatModel = new ChatRepository(ChatModel)
    private _userModel = new UserRepository(UserModel)
    constructor(){}

    // REST API

    getChat = async (req : Request , res : Response) =>{

        const {userId} = req.params as IGetchatDTO
        // OVO (one vs one)
        const chat = await this._chatModel.findOne({
            filter : {
                participants : {
                    $all : [req.user?._id as Types.ObjectId,
                        Types.ObjectId.createFromHexString(userId)
                    ]
                },
                groupName : {$exists : false}
            },
            options : {
                populate : "participants"
            }
        })

        if(!chat){
            throw new NotFoundException("Fail to Find Chat")
        }


        return successResponse({
            res,
            statusCode : 200,
            message : "Done",
            data : chat
        })
    }



    // IO
    sayHi = ({message , socket , callback} : ISayHiDTO) =>{

        try {
            console.log(message);

            callback ? callback("I recieved Your message") : undefined
            
        } catch (error) {
            socket.emit("custom_error" , error)
        }

    }

    sendMessage = async ({content, socket , sendTo } : ISendMessageDTO) => {

        try {
            const createdBy = socket.credentails?.user?._id as Types.ObjectId
            console.log(content , sendTo , createdBy);

            const user = await this._userModel.findOne({
                filter:{
                    _id : Types.ObjectId.createFromHexString(sendTo),
                    friends : {$in : [createdBy]}
                }
            })
            if(!user){
                throw new NotFoundException("User Not Found")
            }
            const chat = await this._chatModel.findOneAndUpdate({
                filter : {
                    participants : {
                    $all : [
                        createdBy as Types.ObjectId,
                        Types.ObjectId.createFromHexString(sendTo)
                    ]
                },

                groupName : {$exists : false}
                },
                update : {
                    $addToSet : {
                        messages : {
                            content,
                            createdBy
                        }
                    }
                }
            })

            if(!chat){
                const [newChat] = await this._chatModel.create({
                    data : [
                    {
                        createdBy,
                        messages : [{content , createdBy}],
                        participants : [createdBy ,Types.ObjectId.createFromHexString(sendTo) ]

                    }]
                }) || []

                if(!newChat){
                    throw new BadRequestException("Fail to create a New Chat")
                }
            }

            socket.emit("successMessage" , {content , sendTo})
            
        } catch (error) {
            socket.emit("custom_error" , error)
        }


    }


}

export default new ChatService()