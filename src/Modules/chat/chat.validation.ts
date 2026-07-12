import z from "zod";
import { generalFields } from "../../Middlewares/Validation.middleware";

export const getChatSchema = {
    params : z.strictObject({
        userId : generalFields.id
    })
}