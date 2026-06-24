import express, { Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit"

const app = express()

const limiter :RateLimitRequestHandler  = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message:{
        statusCode : 429,
        message : "Too many requests, please try again later."  
    }
});



app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(limiter)

app.use("/*dummy" , (req :Request, res: Response) : Response => {
    return res.status(404).json({message : "Not Found Handler!!"})
    
})

export default app;
