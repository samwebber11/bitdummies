import { GraphQLList } from 'graphql'

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

export default products
