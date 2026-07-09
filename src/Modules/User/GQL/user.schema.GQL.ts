import { GraphQLString } from "graphql"
import { userResolver , UserResolver } from "./user.resolver.GQL"
import * as userGqlArgs from "./user.args.GQL"
import * as userGqlTypes from "./user.types.GQL"

class UserGqlSchema {

    private readonly resolver: UserResolver

    constructor(){
        this.resolver = userResolver
    }

    registerQuery() {
        return {

            profile : {
                type :userGqlTypes.profileResponse,
                args : userGqlArgs.profile,
                resolve : this.resolver.getProfile
            }
            
        }
    }

    
    registerMutation() {
        return {

            profile : {
                type :userGqlTypes.profileResponse,
                args : userGqlArgs.profile,
                resolve : this.resolver.getProfile
            }

        }
    }
}



export const userGqlSchema = new UserGqlSchema()