import express, { Router } from "express";
import authService from "./auth.service";

const router: Router  = express.Router()

router.post("/signup" , authService.signup)
// router.get("/login" , authService.login)




export default router

