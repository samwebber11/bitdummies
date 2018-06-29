import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql'
import GraphQLDate from 'graphql-date'

import OrderType from '../types/OrderType'
import OrderByType from '../types/OrderByType'
import Order from '../../database/models/order'

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
  resolve: async (parent, args) => {
    try {
      const ordersList = await Order.find(args.filters).sort(args.orderBy)
      return ordersList
    } catch (err) {
      console.log('Error occurred in fetching orders: ', err)
      throw err
    }
  },
}

// Fetch order by ID.
const order = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const orderPlaced = await Order.findById(args.id)
      return orderPlaced
    } catch (err) {
      console.log('Error occurred in fetching order by ID: ', err)
      throw err
    }
  },
}

export { orders, order }
