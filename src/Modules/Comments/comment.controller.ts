import express, { Router } from "express";
import commentService from "./comment.service";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";
import { validation } from "../../Middlewares/Validation.middleware";
import * as commentValidation from "./comment.validation"

const router: Router  = express.Router({mergeParams : true})


router.post("/create" ,
    authentication({tokenType : TokenTypeEnum.ACCESS}),
    authorization({accessRoles : [RoleEnum.ADMIN , RoleEnum.USER]}),
    validation(commentValidation.createCommentSchema),
    commentService.createComment
)

router.post("/:commentId/reply" ,
    authentication({tokenType : TokenTypeEnum.ACCESS}),
    authorization({accessRoles : [RoleEnum.ADMIN , RoleEnum.USER]}),
    validation(commentValidation.replyCommentSchema),
    commentService.createReply
)



export default router