import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql'

import Product from '../../database/models/product'
import ProductType from './ProductType'

const ProductOrderedType = new GraphQLObjectType({
  name: 'ProductOrdered',
  fields: () => ({
    product: {
      type: new GraphQLNonNull(ProductType),
      resolve: async (parent, args) => {
        try {
          const product = await Product.findById(
            parent.product,
            'name category description imagePath delicacy'
          )
          return product
        } catch (err) {
          console.log('Error in fetching product details in order: ', err)
          throw err
        }
      },
    },
    size: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    actualPrice: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    discountedPrice: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    tax: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
})

export default ProductOrderedType
