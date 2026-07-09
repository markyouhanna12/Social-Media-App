import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userGqlSchema } from "../User/GQL/user.schema.GQL";
import { postGQLSchema } from "../Post/GQL/post.schema.GQL";


const query = new GraphQLObjectType({
    name : "RootQueryType",
    description : "first description optional",
    fields : {

        ...userGqlSchema.registerQuery(),
        ...postGQLSchema.registerQuery()

    }

})


const mutation = new GraphQLObjectType({
    name : "RootSchemaMutation",
    description : "first description optional",
    fields : {   
        ...userGqlSchema.registerMutation()     
    }

})

export const schema = new GraphQLSchema({ query , mutation})