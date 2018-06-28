import { GraphQLObjectType } from 'graphql'

import { products, product } from './productQueries'
import { orders, order } from './orderQueries'
import { addresses } from './addressQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
    product,
    orders,
    order,
    addresses,
  },
})

export default RootQuery
