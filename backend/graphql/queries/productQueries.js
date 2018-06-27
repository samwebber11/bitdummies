import { GraphQLList, GraphQLID } from 'graphql'

import ProductType from '../types/ProductType'
import Product from '../../database/models/product'

const products = {
  type: new GraphQLList(ProductType),
  resolve: (parent, args) => {
    const productsList = Product.find().exec()
    if (!productsList) {
      throw new Error('Error')
    }
    return productsList
  },
}

const product = {
  type: ProductType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: (parent, args) => Product.findById(args.id),
}

export { products, product }
