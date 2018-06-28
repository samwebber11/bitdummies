import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
} from 'graphql'

const ProductInputType = new GraphQLInputObjectType({
  name: 'ProductInputType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    actualPrice: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    tax: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    discountedPrice: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    size: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export default ProductInputType
