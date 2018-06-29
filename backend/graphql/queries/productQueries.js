import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import ProductType from '../types/ProductType'
import Product from '../../database/models/product'

const products = {
  type: new GraphQLList(ProductType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortProductsBy',
        fields: {
          // TODO: Should change it to enum type of 'asc' and 'desc'.
          name: {
            type: GraphQLString,
          },
          actualPrice: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const productsList = await Product.find({}).sort(args.orderBy)
      return productsList
    } catch (err) {
      console.log('Error occurred in fetching products: ', err)
      throw err
    }
  },
}

const product = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const dbProduct = await Product.findById(args.id)
      return dbProduct
    } catch (err) {
      console.log('Error occurred in fetching product by ID: ', err)
      throw err
    }
  },
}

export { products, product }
