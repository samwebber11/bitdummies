import { GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql'

const UserProviderType = new GraphQLObjectType({
  name: 'UserProvider',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export default UserProviderType
