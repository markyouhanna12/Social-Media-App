import express, { Router } from "express";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";
import { validation } from "../../Middlewares/Validation.middleware";
import * as ChatValidation from "./chat.validation";
import chatService from "./chat.service";

const router: Router  = express.Router({
    mergeParams : true
})

router.get("/",
    authentication({tokenType : TokenTypeEnum.ACCESS}),
    authorization({accessRoles : [RoleEnum.ADMIN , RoleEnum.USER]}),
    validation(ChatValidation.getChatSchema),
    chatService.getChat

)



export default router
