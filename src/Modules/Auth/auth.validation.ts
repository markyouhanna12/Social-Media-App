import {z} from "zod"



export const loginSchema ={
    body : z.strictObject({
    
        email : z
        .email({error: "Invalid email"}),

        password : z
        .string({error: "Password is required"})
        .min(6, {error: "Password must be at least 6 characters"}),

    })
}


export const signupSchema ={
    body : loginSchema.body.extend({

        username : z
        .string({error: "Username is required"})
        .min(3, {error: "Username must be at least 3 characters"})
        .max(20, {error: "Username must be at most 20 characters"}),

        confirmPassword : z
        .string({error: "Confirm Password is required"})
        .min(6, {error: "Confirm Password must be at least 6 characters"}),

        gender : z
        .enum(["male", "female"], {error: "Gender must be male or female"})
        .optional(),

        skills : z.array(z.string()).optional(),

        age : z
        .number()
        .int()
        .min(18, {error: "Age must be at least 18"})
        .max(120, {error: "Age must be at most 120"})
        .optional()
    })
    .superRefine((data, ctx) => {
        if(data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords don't match",
                path: ["confirmPassword"]
            })
        }
        // username 2 words
        if(data.username.split(" ").length !== 2) {
            ctx.addIssue({
                code: "custom",
                message: "Username must be 2 words",
                path: ["username"]
            })
        }

    })
}



