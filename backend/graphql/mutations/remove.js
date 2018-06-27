import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { Product } from '../../database/models/product'
import { productType } from '../types/productType'

exports.removeProduct = {
  type: productType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(root, params) {
    const removeProduct = Product.findByIdAndRemove(params.id).exec()
    if (!removeProduct) {
      throw new Error('Error')
    }
    return removeProduct
  },
}
