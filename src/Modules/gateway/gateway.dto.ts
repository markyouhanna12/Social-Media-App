import { JwtPayload } from "jsonwebtoken"
import { HUserDocument } from "../../DB/Models/user.model"
import { Socket } from "socket.io"

export interface IAuthSocket extends Socket {
    credentails? : {
        user : Partial<HUserDocument>,
        decoded : JwtPayload
    }
    }
