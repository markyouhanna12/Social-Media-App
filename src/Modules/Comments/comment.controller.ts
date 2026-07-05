import express, { Router } from "express";
import commentService from "./comment.service";


const router: Router  = express.Router()

router.get("/" , commentService.getComment)


export default router