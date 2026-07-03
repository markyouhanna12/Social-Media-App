import {z} from "zod"
import { generalFields } from "../../Middlewares/Validation.middleware"
import { AvailabitlityEnum } from "../../Utils/enums/auth.enum"
import { Types } from "mongoose"

export const createPostSchema = {
    body : z.strictObject({
        content: z
        .string()
        .optional(),

        files: z
        .array(generalFields.file(["image/png", "image/jpeg", "image/jpg"]))
        .optional(),

        tags : z
        .array(z.string())
        .optional(),

        availability : z
        .coerce
        .number()
        .default(AvailabitlityEnum.PUBLIC)



    }).superRefine((args , ctx) => {
        if(!args.files?.length && !args.content){
            ctx.addIssue({
                code: "custom",
                message: "Content or Attachment is required",
                path: ["content" , "files"]
            })

        }
        if(args.tags?.length){
                const uniqueTags = [...new Set(args.tags)]
                if(uniqueTags.length !== args.tags.length){
                    ctx.addIssue({
                        code: "custom",
                        message: "Duplicate tags are not allowed",
                        path: ["tags"]
                    })
                }
            }

        for(const tag of args.tags || []){
            if(!Types.ObjectId.isValid(tag)){
                ctx.addIssue({
                    code: "custom",
                    message: "Invalid tag id",
                    path: ["tags"]
                })
            }
        }

    })
}


export const reactPostSchema = {
    params : z.strictObject({
        postId : generalFields.id
    }),
    query : z.strictObject({
        react : z.coerce.number()
    })
}