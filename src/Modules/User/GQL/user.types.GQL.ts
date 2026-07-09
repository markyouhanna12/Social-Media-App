import { GraphQLEnumType, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../../Utils/enums/auth.enum";
import { HUserDocument } from "../../../DB/Models/user.model";


export const GenderEnumType  = new GraphQLEnumType({
    name : "GenderEnum",
    values : {
        Male : {value : GenderEnum.MALE},
        Female : {value : GenderEnum.FEMALE}

    }
})

export const RoleEnumType = new GraphQLEnumType({
    name : "RoleEnum",
    values : {
        USER : {value : RoleEnum.USER},
        ADMIN : {value : RoleEnum.ADMIN}
    }
})

export const ProviderEnumType = new GraphQLEnumType({
    name : "ProviderEnum",
    values : {
        Google : {value : ProviderEnum.Google},
        System : {value : ProviderEnum.System}
    }
})

export const oneUserGqlType : GraphQLObjectType = new GraphQLObjectType({
    name : "oneUserResponse",
    fields : () => ({
        _id : {
            type : GraphQLID
        },
        username : {
            type : GraphQLString,
            resolve : (parent : HUserDocument) =>{
            return parent.gender === GenderEnum.MALE ? `MR::${parent.username}`
            : `MRS::${parent.username}`}
        },
        firstName : {
            type :new GraphQLNonNull(GraphQLString)
        },
        lastName : {
            type : new GraphQLNonNull(GraphQLString)
        },
        email : {
            type : new GraphQLNonNull(GraphQLString)
        },
        password : {
            type : GraphQLString
        },
        phone : {
            type : GraphQLString
        },
        confirmEmail : {
            type : GraphQLString
        },
        address : {
            type : GraphQLString
        },
        changeCredentialsTime : {
            type : GraphQLString
        },
        gender: {
            type : GenderEnumType
        },
        role : {
            type : RoleEnumType
        },
        provider : {
            type : ProviderEnumType
        },
        profilePic : {
            type : GraphQLString
        },
        createdAt : {
            type : GraphQLString
        },
        updatedAt : {
            type : GraphQLString
        }
        
    })
})


export const profileResponse = new GraphQLObjectType({
    name : "profileResponse",
    fields : {
        message : {type : new GraphQLNonNull(GraphQLString)},
        data : {
            type : oneUserGqlType
        }
    }
})