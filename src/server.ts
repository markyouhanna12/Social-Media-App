import chalk from "chalk"
import app from "./app"
import { PORT } from "./config/config.service";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./Socket/socket";


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // change this in production
    },
});
initializeSocket(io);

const startServer = async () => {
    try {
        httpServer.listen(PORT, () => {
            console.log(
                chalk.bold.blue(`HTTP & Socket.IO server running on port ${PORT}`)
            );
        });
    } catch (error) {
        console.log(chalk.red(String(error)));
    }
};

startServer();