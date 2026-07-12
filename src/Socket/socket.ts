import { Server, Socket } from "socket.io";
import { TokenService } from "../Utils/services/token";
import { TokenTypeEnum } from "../Utils/enums/auth.enum";
import { HUserDocument } from "../DB/Models/user.model";
import { JwtPayload } from "jsonwebtoken";

export const initializeSocket = (io: Server) => {
    //http:localhost:3000/

        interface IAuthSocket extends Socket {
        credentails? : {
            user : Partial<HUserDocument>,
            decoded : JwtPayload
        }
    }

    const connectedSockets = new Map <string , string[]>()

    io.use(async(socket : IAuthSocket , next) =>{
       try {
        const tokenService = new TokenService()
        const {user , decoded} = await tokenService.decodedToken({
            authorization : socket.handshake.auth["authorization"],
            tokenType : TokenTypeEnum.ACCESS
        })

        const userTabs = connectedSockets.get(user._id.toString()) || []
        userTabs.push(socket.id)

        connectedSockets.set(user._id.toString() , userTabs)

        socket.credentails = {user , decoded}


        next()
        
       } catch (error : any) {
        next(error)
       }
    })
    
    io.on("connection", (socket : IAuthSocket) => {
        console.log(`Connected: ${socket.id}`);
        console.log(connectedSockets);        
        

        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
            const userId = socket.credentails?.user._id?.toString() as string
            let remainingTabs = connectedSockets.get(userId)?.filter((tab) =>{
                return tab !== socket.id
            }) || []

            if(remainingTabs.length){
                connectedSockets.set(userId , remainingTabs)
            }else{
                connectedSockets.delete(userId)
            }

            console.log(connectedSockets);
            
        });
    });

    io.of("/admin").on("connection" , (socket) =>{

        console.log(`Connected admin : ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Disconnected admin : ${socket.id}`);
        });


    })

};
