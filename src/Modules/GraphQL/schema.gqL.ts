import { GraphQLObjectType, GraphQLSchema } from "graphql";


const query = new GraphQLObjectType({
    name : "RootQueryType",
    description : "first description optional",
    fields : {

    }

})


const mutation = new GraphQLObjectType({
    name : "RootSchemaMutation",
    description : "first description optional",
    fields : {
        
    }

})


export const schema = new GraphQLSchema({ query , mutation})