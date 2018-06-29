import { GraphQLObjectType } from 'graphql'

import { products, product } from './productQueries'
import { orders, order } from './orderQueries'
import { addresses, address } from './addressQueries'
import { users, user } from './userQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
    product,
    orders,
    order,
    addresses,
    address,
    users,
    user,
  },
})

export default RootQuery
