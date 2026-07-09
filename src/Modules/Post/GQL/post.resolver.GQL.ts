import postService from "../post.service";

export class PostResolver {
    postList = async (_:any , __:any , context : any) =>{
        const {user} = context
        const data = await postService.getPosts(user)

        return {
            message : "Done",
            data : {
                docs : data
            }
        }
    }
}

export const postResolver = new PostResolver()