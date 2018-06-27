import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import { Product } from '../../database/models/product'
import { productType } from '../types/productType'

exports.updateProduct = {
  type: productType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLString),
    },
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
    return Product.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: params.name,
          category: params.category,
          size: params.size,
          description: params.description,
          actualPrice: params.actualPrice,
          discount: params.discount,
          tax: params.tax,
          quantityAvailable: params.quantityAvailable,
          delicacy: params.delicacy,
        },
      },
      { new: true }
    ).catch(err => new Error(err))
  },
}
