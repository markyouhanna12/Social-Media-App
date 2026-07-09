import { UserRepository } from "../../DB/repositories/user.repo";
import { UserModel } from "../../DB/Models/user.model";
import { decrypt } from "../../Utils/security/encryption";


class UserService {
        private _userRepo = new UserRepository(UserModel)
    
        constructor(){}
    
      getProfile = async (user : any) =>{
        user.phone = await decrypt(user.phone)
        return {
          message : "User Profile",
          data : user
        }
      } 
}


export default new UserService