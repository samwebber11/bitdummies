import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
} from 'graphql'

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    category: {
      type: GraphQLString,
    },
    size: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    actualPrice: {
      type: GraphQLFloat,
    },
    discount: {
      type: GraphQLInt,
    },
    tax: {
      type: GraphQLFloat,
    },
    quantityAvailable: {
      type: GraphQLInt,
    },
    delicacy: {
      type: GraphQLString,
    },
  }),
})

export default ProductType
