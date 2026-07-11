import { Server, Socket } from "socket.io";
import { TokenService } from "../Utils/services/token";
import { TokenTypeEnum } from "../Utils/enums/auth.enum";

export const initializeSocket = (io: Server) => {
    //http:localhost:3000/

    const connectedSockets = new Map <string , string>()

    io.use(async(socket : Socket , next) =>{
       try {
        const tokenService = new TokenService()
        const {user , decoded} = await tokenService.decodedToken({
            authorization : socket.handshake.auth["authorization"],
            tokenType : TokenTypeEnum.ACCESS
        })

        connectedSockets.set(user._id.toString() , socket.id)
        next()
        
       } catch (error : any) {
        next(error)
       }
    })
    
    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);
        console.log(connectedSockets);
        

        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
            connectedSockets.delete("6a3e0cc1bdfb5092afccf958")
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
