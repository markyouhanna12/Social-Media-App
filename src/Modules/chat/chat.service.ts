import { ISayHiDTO } from "./chat.dto";

export class ChatService {
    constructor(){}

    // REST API



    // IO
    sayHi = ({message , socket , callback} : ISayHiDTO) =>{

        try {
            console.log(message);

            callback ? callback("I recieved Your message") : undefined
            
        } catch (error) {
            socket.emit("custom_error" , error)
        }

    }


}