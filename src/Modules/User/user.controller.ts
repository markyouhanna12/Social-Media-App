import express, { Request, Response, Router } from "express";
import userService from "./user.service";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";
import { successResponse } from "../../Utils/response/success.response";


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

export default router
