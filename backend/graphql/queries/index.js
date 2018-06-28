import { GraphQLObjectType } from 'graphql'

import { products, product } from './productQueries'
import { orders, order } from './orderQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
    product,
    orders,
    order,
  },
})

export default RootQuery
