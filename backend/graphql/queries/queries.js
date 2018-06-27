import { GraphQLObjectType, GraphQLList } from 'graphql'

import { productType } from '../types/productType'
import { Product } from '../../database/models/product'

// Queries
exports.queryProductType = new GraphQLObjectType({
  name: 'ProductQuery',
  fields() {
    return {
      productDetails: {
        type: new GraphQLList(productType),
        resolve() {
          const products = Product.find().exec()
          if (!products) {
            throw new Error('Error')
          }
          return products
        },
      },
    }
  },
})
