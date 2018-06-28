import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql'

const SizeInputType = new GraphQLInputObjectType({
  name: 'SizeInput',
  fields: {
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantityAvailable: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
})

export default SizeInputType
