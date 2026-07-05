import {z} from "zod"
import { createCommentSchema } from "./comment.validation"

export type CreateCommentDTO = z.infer<typeof createCommentSchema.body>
export type CreateParamsCommentDTO = z.infer<typeof createCommentSchema.params>
