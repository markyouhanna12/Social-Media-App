import { PostResolver ,  postResolver } from "./post.resolver.GQL";
import * as postTypes from "./post.types.GQL"

export class PostGQLSchema {
    private readonly resolver : PostResolver
    constructor(){
        this.resolver = postResolver
    }

    registerQuery(){
        return {
            postList : {
                type :postTypes.postList ,
                resolve : this.resolver.postList
            }
        }
    }
}

export const postGQLSchema = new PostGQLSchema()