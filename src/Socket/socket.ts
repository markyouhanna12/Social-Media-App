import { Server } from "socket.io";

export const initializeSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);

        socket.emit("product" , {
            id : 1,
            title : "apple laptop",
            price : 2000
        })


        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });
};
