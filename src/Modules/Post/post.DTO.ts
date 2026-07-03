import {z} from "zod"
import { createPostSchema, reactPostSchema } from "./post.validation"

export type CreatePostDTO = z.infer<typeof createPostSchema.body>
export type ReactQueryPostDTO = z.infer<typeof reactPostSchema.query>
export type ReactParamsPostDTO = z.infer<typeof reactPostSchema.params>
