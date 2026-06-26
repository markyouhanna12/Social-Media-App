import { Schema , HydratedDocument } from "mongoose";
import { GenderEnum, RoleEnum } from "../../Utils/enums/auth.enum";
import mongoose from "mongoose";

// interface
export interface IUser {
    firstName : string;
    lastName : string;
    username?: string;


    email : string;
    confirmEmailOTP?: string;
    confirmEmail?: Date;

    password : string;
    resetPasswordOTP?: string;

    phone?: string;
    address?: string;

    gender?: GenderEnum;
    role?: RoleEnum;

    createdAt : Date;
    updatedAt? : Date;
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
    confirmEmail: {
        type: Date
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordOTP: {
        type: String
    },
    phone: {
        type: String
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
    }



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

export const UserModel = mongoose.model<IUser>("User", userSchema)

export type HUserDocument = HydratedDocument<IUser>