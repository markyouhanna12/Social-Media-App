import {model , Schema , Types} from "mongoose"
import { IUser } from "./user.model";
import { AvailabitlityEnum } from "../../Utils/enums/auth.enum";

export interface IPost {
    folderId ? : string;
    content ? : string | undefined;
    attachments ? : string[];

    likes ? : Types.ObjectId[] | IUser[];
    tags ? : Types.ObjectId[] | string[];
    availability ? : AvailabitlityEnum
   

    createdBy : Types.ObjectId | IUser
    updatedBy ?: Types.ObjectId | IUser

    deletedAt ?: Date;
    restoredAt ?: Date

    createdAt : Date;
    updatedAt ?: Date;
    

}


const postSchema = new Schema<IPost>({
    folderId : {
        type : String,
        
    } , 
    content : {
        type : String,
        required : function (this){
            return !this.attachments?.length
        }
    },
    attachments : {
        type : [String],
        default : []
    },
    availability : {
        type : Number,
        enum : AvailabitlityEnum,
        default : AvailabitlityEnum.PUBLIC
    },
    likes :[{
        type:Schema.Types.ObjectId,
        ref:"User",
        
    }],
    tags :[{
        type:Schema.Types.ObjectId,
        ref:"User",
        
    }],

    createdBy :{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
        
    },
    updatedBy : {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    deletedAt : {
        type:Date
    },
    restoredAt : {
        type:Date
    }

} , {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


export const PostModel = model<IPost>("Post", postSchema)