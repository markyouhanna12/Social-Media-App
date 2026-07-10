import { Server } from "socket.io";

export const initializeSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);

        socket.on("sayHi" , (data) => {
            console.log(data);
            
        })

        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });
};
