import { GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql'

const UserProviderInputType = new GraphQLInputObjectType({
  name: 'UserProviderInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export default UserProviderInputType
