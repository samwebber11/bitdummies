import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'

const SizeType = new GraphQLObjectType({
  name: 'Size',
  fields: {
    label: {
      type: GraphQLString,
    },
    quantityAvailable: {
      type: GraphQLInt,
    },
  },
})

export default SizeType
