import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import ProductType from '../types/ProductType'
import OrderByType from '../types/OrderByType'
import {
  productsResolver,
  productResolver,
} from '../resolvers/queries/productResolvers'

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
  resolve: productsResolver,
}

// Fetch product by ID.
const product = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: productResolver,
}

export { products, product }
