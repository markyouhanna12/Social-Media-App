import { IAuthSocket } from "../gateway/gateway.dto";
import { ChatEvents } from "./chat.events";

export class ChatGateway {
    private _chatEvent = new ChatEvents()
    constructor() {}

    register = (socket : IAuthSocket) =>{

        this._chatEvent.sayHi(socket)
        this._chatEvent.sendMessage(socket)
        
    }
}