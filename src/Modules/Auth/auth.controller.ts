import express, { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middlewares/Validation.middleware";
import * as authValidation from "./auth.validation";
const router: Router  = express.Router()

router.post("/signup" ,validation(authValidation.signupSchema) , authService.signup)
router.patch("/confirm-email" ,validation(authValidation.confirmEmailSchema) , authService.confirmEmail)


// router.get("/login" , authService.login)




export default router

