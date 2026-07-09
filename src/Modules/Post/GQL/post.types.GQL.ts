import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { AvailabitlityEnum } from "../../../Utils/enums/auth.enum";
import { oneUserGqlType } from "../../User/GQL/user.types.GQL";


export const PostGqlAvailabilityEnum = new GraphQLEnumType({
    name : "AvailabilityEnum",
    values : {
        Public : {value : AvailabitlityEnum.PUBLIC},
        Friends : {value : AvailabitlityEnum.FRIENDS},
        Only_me : {value : AvailabitlityEnum.ONLY_ME}

    }
})


export const OnePostType = new GraphQLObjectType({
    name : "OnePostResponse",
    fields : {
        _id : {
            type : new GraphQLNonNull(GraphQLString),
        },
        content : {
            type : GraphQLString
        },
        attachments : {
            type : new GraphQLList (GraphQLString)
        },
        likes : {
            type : new GraphQLList (GraphQLID)
        },
        tags : {
            type : new GraphQLList (GraphQLID)
        },
        createdBy : {
            type : new GraphQLNonNull (oneUserGqlType)
        },
        updatedBy : {
            type : GraphQLID
        },
        availability : {
            type : PostGqlAvailabilityEnum
        },
        createdAt : {
            type : GraphQLString
        },
        deletedAt : {
            type : GraphQLString
        },
        restoredAt : {
            type : GraphQLString
        },
        updatedAt : {
            type : GraphQLString
        },

    }
})

export const postList = new GraphQLObjectType({
    name : "PostListResponse",
    description : "fill all posts",
    fields : {
        message : {type : GraphQLString},
        data : {
            type : new GraphQLObjectType({
                name : "postList",
                fields : {
                    docs : {
                        type : new GraphQLList(OnePostType)
                    }
                }
            })
        }
    }

})