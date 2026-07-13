import { Schema , HydratedDocument, Types } from "mongoose";
import mongoose from "mongoose";

// interface

export interface IMessage {

    content : string;
    createdBy : Types.ObjectId;
    createdAt ?: Date;
    updatedAt? : Date;

  
}
export interface IChat {

    // OVO (one versus one)
    participants : Types.ObjectId[];
    messages : IMessage[];



    // OVM (one versus many)
    groupName? : string;
    groupImage? : string;
    roomId? : string;

    // common
    createdBy : Types.ObjectId;
    createdAt : Date;
    updatedAt? : Date;

  
}
        


export const messageSchema = new Schema<IMessage>({

    content : {
        type : String,
        required : true,
        maxlength : 50000,
        minlength : 2,
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
  

},{
    timestamps : true,
})



export const chatSchema = new Schema<IChat>({

    participants :[{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }],
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    groupName : {
        type : String
    },
    groupImage : {
        type : String
    },
    roomId : {
        type : String,
        required : function () {
            return this.roomId
        }
    },
    messages : [
        messageSchema
    ]

  

},{
    timestamps : true,
})


export type ChatDocument = HydratedDocument<IChat>;
export type MessageDocument = HydratedDocument<IMessage>;


export const ChatModel = mongoose.model<IChat>("Chat", chatSchema)

