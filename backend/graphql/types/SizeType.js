import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql'

const SizeType = new GraphQLObjectType({
  name: 'Size',
  fields: {
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantityAvailable: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
})

export default SizeType
