import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from 'graphql'

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    address1: {
      type: GraphQLString,
    },
    address2: {
      type: GraphQLString,
    },
    landmark: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    zip: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
  }),
})

export default AddressType
