import { Server } from "socket.io";

export const initializeSocket = (io: Server) => {
    //http:localhost:3000/
    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);

        // socket.emit("product" , { id : 1, title : "apple laptop", price : 2000})
        socket.on("sayHi", (data , callback) =>{
            console.log(data);
            callback("Hi from Backend I recievied all the Data")
            
        } )


        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });

    io.of("/admin").on("connection" , (socket) =>{

        console.log(`Connected admin : ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Disconnected admin : ${socket.id}`);
        });


    })

};
