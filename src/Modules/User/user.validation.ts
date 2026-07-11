import z from "zod";
import { generalFields } from "../../Middlewares/Validation.middleware";

export const sendFriendRequestSchema = {
    params : z.strictObject({
        userId : generalFields.id
    })
}