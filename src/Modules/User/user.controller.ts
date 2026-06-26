import express, { Router } from "express";
import userService from "./user.service";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";


const router: Router  = express.Router()

router.get(
    "/profile",
    authentication({tokenType: TokenTypeEnum.ACCESS}),
    authorization({accessRoles:[RoleEnum.USER]}),
    userService.getProfile
)

export default router
