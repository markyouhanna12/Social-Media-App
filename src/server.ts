import chalk from "chalk"
import app from "./app"

const PORT = 3000

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
