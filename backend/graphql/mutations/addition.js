import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { Product } from '../../database/models/product'
import { productType } from '../types/productType'

exports.addProduct = {
  type: productType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    category: {
      type: new GraphQLNonNull(GraphQLString),
    },
    size: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    actualPrice: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    tax: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    quantityAvailable: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    delicacy: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve(root, params) {
    const pro = new Product(params)
    const newProduct = pro.save()
    if (!newProduct) {
      throw new Error('Error')
    }
    return newProduct
  },
}
