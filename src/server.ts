import chalk from "chalk"
import app from "./app"
import { PORT } from "./config/config.service";


const startServer = async () =>{
    try {
        
        app.listen(PORT,()=>{
            console.log(chalk.bold.blue(`Server running on port ${PORT}`));
            
        })

    } catch (error) {
        console.log(chalk.red(String(error)));
 
    }
}

startServer()
