import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
} from 'graphql'

import SizeType from './SizeType'

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
      type: new GraphQLList(SizeType),
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
    discountedPrice: {
      type: GraphQLFloat,
    },
    tax: {
      type: GraphQLFloat,
    },
    imagePath: {
      type: new GraphQLList(GraphQLString),
    },
    delicacy: {
      type: GraphQLString,
    },
  }),
})

export default ProductType
