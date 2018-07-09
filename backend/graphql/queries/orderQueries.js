import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql'
import GraphQLDate from 'graphql-date'

import OrderType from '../types/OrderType'
import OrderByType from '../types/OrderByType'
import {
  ordersResolver,
  orderResolver,
} from '../resolvers/queries/orderResolvers'

// Fetch all orders (can be filtered).
const orders = {
  type: new GraphQLList(OrderType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortOrdersBy',
        fields: {
          orderedAt: {
            type: OrderByType,
          },
        },
      }),
    },
    filters: {
      type: new GraphQLInputObjectType({
        name: 'FilterOrdersBy',
        fields: {
          orderedAt: {
            type: GraphQLDate,
          },
        },
      }),
    },
  },
  resolve: ordersResolver,
}

// Fetch order by ID.
const order = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: orderResolver,
}

export { orders, order }
