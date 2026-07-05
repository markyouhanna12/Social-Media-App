import { Request, Response } from "express";
import { successResponse } from "../../Utils/response/success.response";

class CommentService {
    constructor(){}


    getComment = async (req : Request , res : Response ) : Promise<Response> => {

        return successResponse({
            res,
            statusCode : 200,
            message : "welcome to comment service"

        })

    }
}


export default new CommentService()