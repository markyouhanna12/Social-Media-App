import { Server } from "socket.io";
import { TokenService } from "../../Utils/services/token";
import { TokenTypeEnum } from "../../Utils/enums/auth.enum";
import { IAuthSocket } from "./gateway.dto";
import { ChatGateway } from "../chat/chat.gateway";


export let socketServer: Server;

export const connectedSockets = new Map <string , string[]>()


export const initializeSocket = (io: Server) => {
    
    socketServer = io;

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


    function disconnectSocket(socket : IAuthSocket){
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
    }

    // connection io

    const chatGateway = new ChatGateway()
    io.on("connection", (socket : IAuthSocket) => {
        console.log(`Connected: ${socket.id}`);
        console.log(connectedSockets);
        chatGateway.register(socket)        
        disconnectSocket(socket)

    });

    
};
