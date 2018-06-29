import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import ProductType from '../types/ProductType'
import OrderByType from '../types/OrderByType'
import Product from '../../database/models/product'

// Fetch the list of all products (can be filtered).
const products = {
  type: new GraphQLList(ProductType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortProductsBy',
        fields: {
          name: {
            type: OrderByType,
          },
          actualPrice: {
            type: OrderByType,
          },
          category: {
            type: OrderByType,
          },
        },
      }),
    },
    filters: {
      type: new GraphQLInputObjectType({
        name: 'FilterProductsBy',
        fields: {
          category: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const productsList = await Product.find(args.filters).sort(args.orderBy)
      return productsList
    } catch (err) {
      console.log('Error occurred in fetching products: ', err)
      throw err
    }
  },
}

// Fetch product by ID.
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
