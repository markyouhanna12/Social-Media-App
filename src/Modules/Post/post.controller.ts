import express, { Request, Response, Router } from "express";
import { authentication, authorization } from "../../Middlewares/Auth.middleware";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/auth.enum";
import postService from "./post.service";
import { validation } from "../../Middlewares/Validation.middleware";
import * as postValidation from "./post.validation"
import CommentsRouter from "../Comments/comment.controller"
import { successResponse } from "../../Utils/response/success.response";


const router: Router  = express.Router()

router.use("/:postId/comment" ,CommentsRouter)

router.post("/", 
    authentication({tokenType: TokenTypeEnum.ACCESS}), 
    authorization({accessRoles:[RoleEnum.USER]}),
    validation(postValidation.createPostSchema),
    postService.createPost

)


router.patch("/:postId/react", 
    authentication({tokenType: TokenTypeEnum.ACCESS}), 
    authorization({accessRoles:[RoleEnum.USER]}),
    validation(postValidation.reactPostSchema),
    postService.reactPost
)

router.get("/", 
    authentication({tokenType: TokenTypeEnum.ACCESS}), 
    async (req : Request , res : Response) => {
        const data = await postService.getPosts(req.user)
        return successResponse({
            res,statusCode : 200,
            message : "Posts retrieved successfully",
            data
        })
    }
)


export default router