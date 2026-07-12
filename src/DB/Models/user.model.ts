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
export interface IUser {
    firstName : string;
    lastName : string;
    username?: string;


    email : string;
    confirmEmailOTP?: string;
    confirmEmailAt?: Date;

    password : string;
    resetPasswordOTP?: string;

    phone: string;
    address?: string;

    gender?: GenderEnum;
    role?: RoleEnum;

    createdAt : Date;
    updatedAt? : Date;

    changeCredentialsTime?:Date

    provider? : string;

    profilePic? : string;

    friends? : Types.ObjectId[]
}
        




export const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    confirmEmailOTP: {
        type: String
    },
    confirmEmailAt: {
        type: Date
    },
    password: {
        type: String,
        required: function  () : boolean { return this.provider === ProviderEnum.System }
    },
    resetPasswordOTP: {
        type: String
    },
    phone: {
        type: String,
        required : true
    },
    address: {
        type: String
    },
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
    },
    role: {
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.USER
    },
    changeCredentialsTime :{
        type : Date
    }, 
    provider : {
        type : String,
        enum : Object.values(ProviderEnum),
        default : ProviderEnum.System
    },
    profilePic : {
        type : String
    },
    friends : [
        {
        type : Schema.Types.ObjectId,
        ref : "User"
        }
    ]



},{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})


// user will send username that we will split it to get first and last name

userSchema
    .virtual("username")
    .set(function(value: string) {
        const [firstName, lastName] = value.split(" ") || [];
        this.set({firstName , lastName})
    })
    .get(function() {
        return `${this.firstName} ${this.lastName}`
    })


    // Document middleware validate
    userSchema.pre("validate" , function() {
        
        this.email = this.email.toLowerCase().trim()
    })

    userSchema.pre("save", async function(this : HUserDocument & {wasNew : boolean}) {
        // logic of middleware
        this.wasNew = this.isNew
        if(this.isModified("password")) {

            this.password = await genrateHash(this.password)
        }

        if(this.isModified("phone")){
            this.phone = await encrypt(this.phone)
        }

        
    })

    // Document middleware save

    userSchema.post("save" , async function (){
        const that = this as HUserDocument & {wasNew : boolean}
        if(that.wasNew){
            await emailEvents.emit("confirmEmail" ,{
                to: this.email,
                username: this.username,
                otp : generateOTP()
            })
        }
    })
  

export const UserModel = mongoose.model<IUser>("User", userSchema)

export type HUserDocument = HydratedDocument<IUser>