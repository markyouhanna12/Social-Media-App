import { Schema , HydratedDocument, Types } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/auth.enum";
import mongoose from "mongoose";
import { BadRequestException } from "../../Utils/response/error.response";
import { genrateHash } from "../../Utils/security/hash";
import { encrypt } from "../../Utils/security/encryption";
import { emailEvents } from "../../Utils/events/email.event";
import { ota } from "zod/v4/locales";
import { generateOTP } from "../../Utils/generateOTP";

// interface
export interface IFriendRequest {
    
    createdBy: Types.ObjectId;

    sendTo: Types.ObjectId;

    acceptedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}
        




export const friendSchema = new Schema<IFriendRequest>({

    createdBy : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    sendTo : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    acceptedAt : {
        type : Date
    }


},{
    timestamps : true
})



export const FriendModel = mongoose.model<IFriendRequest>("Friend", friendSchema)

export type HFriendDocument = HydratedDocument<IFriendRequest>