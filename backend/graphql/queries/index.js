import { GraphQLObjectType } from 'graphql'

import { products, product } from './productQueries'
import { Orders, orders } from './orderQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
    product,
    Orders,
    orders,
  },
})

export default RootQuery
