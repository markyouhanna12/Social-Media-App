import express, { Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit"
import AuthRouter from "./Modules/Auth/auth.controller"
import { globalErrorHandler, NotFoundException } from "./Utils/response/error.response"
import { corsOptions } from "./Utils/cors/cors.utils"
import { customRateLimiter } from "./Middlewares/rateLimitter.middleware"
import connectDB from "./DB/connection"
import UserRouter from "./Modules/User/user.controller"
// import PostRouter from "./Modules/Post/post.controller"
// import CommentsRouter from "./Modules/Comments/comments.controller"

const app = express()

connectDB()

app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())
app.use(customRateLimiter)

app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)
// app.use("/api/post", PostRouter)
// app.use("/api/comments", CommentsRouter)

app.use(globalErrorHandler)

app.use("/*dummy" , (req :Request, res: Response) : Response => {
    throw new NotFoundException("Not Found Handler!")
    
})

export default app;
