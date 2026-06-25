import { Request, Response } from "express";

class AuthenticationService {

    private _username : string = "mark"

    constructor(){}

    signup = (req: Request , res : Response) : Response =>{
        console.log(this._username);
        return res.status(200).json({message: "Hello From signup"})
    }
    

}

export default new AuthenticationService