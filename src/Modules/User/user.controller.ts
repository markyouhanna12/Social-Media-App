import express, { Request, Response, Router } from "express";
import userService from "./user.service";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";
import { successResponse } from "../../Utils/response/success.response";
import { validation } from "../../Middlewares/Validation.middleware";
import * as userValidations from "./user.validation"

const router: Router  = express.Router()

router.get(
    "/profile",
    authentication({tokenType: TokenTypeEnum.ACCESS}),
    authorization({accessRoles:[RoleEnum.USER]}),
    async (req : Request , res : Response) => {
        const user = req.user
        const data = await userService.getProfile(user)
        return successResponse({res,message:"Done",statusCode:200,data})
    }
)

router.post(
    "/:userId/friend-request",
    authentication({tokenType : TokenTypeEnum.ACCESS}),
    authorization({accessRoles : [RoleEnum.ADMIN , RoleEnum.USER]}),
    validation(userValidations.sendFriendRequestSchema),
    userService.sendFriendRequest

)

router.patch(
    "/:requestId/accept",
    authentication({tokenType : TokenTypeEnum.ACCESS}),
    authorization({accessRoles : [RoleEnum.ADMIN , RoleEnum.USER]}),
    validation(userValidations.acceptFriendRequestSchema),
    userService.acceptFriendRequest

)

export default router
