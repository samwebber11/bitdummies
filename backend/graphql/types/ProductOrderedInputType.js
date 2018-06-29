import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql'

const ProductOrderedInputType = new GraphQLInputObjectType({
  name: 'ProductOrderedInput',
  fields: {
    product: {
      type: new GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    size: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export default ProductOrderedInputType
