import express, { Router } from "express";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";
import postService from "./post.service";


const router: Router  = express.Router()

router.post("/", 
    authentication({tokenType: TokenTypeEnum.ACCESS}), 
    authorization({accessRoles:[RoleEnum.USER]}),
    postService.createPost

)

export default router