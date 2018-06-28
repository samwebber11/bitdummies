import { GraphQLObjectType } from 'graphql'

import { products, product } from './productQueries'
import { orders, order } from './orderQueries'
import { address, addresses } from './addressQueries'
import { users, user } from './userQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
    product,
    orders,
    order,
    address,
    addresses,
    users,
    user,
  },
})

export default RootQuery
