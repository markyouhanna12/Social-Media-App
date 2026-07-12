import { Request, Response } from "express";
import { IGetchatDTO, ISayHiDTO } from "./chat.dto";
import { successResponse } from "../../Utils/response/success.response";
import { ChatRepository } from "../../DB/repositories/chat.repo";
import { ChatModel } from "../../DB/Models/chat.model";
import { UserRepository } from "../../DB/repositories/user.repo";
import { UserModel } from "../../DB/Models/user.model";
import { Types } from "mongoose";
import { NotFoundException } from "../../Utils/response/error.response";

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


}

export default new ChatService()