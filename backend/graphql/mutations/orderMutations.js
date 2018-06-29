import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'
import GraphQLDate from 'graphql-date'

import Order from '../../database/models/order'
import OrderType from '../types/OrderType'
import ProductOrderedType from '../types/ProductOrderedType'
import PaymentInputType from '../types/PaymentInputType'

const addOrder = {
  type: OrderType,
  args: {
    products: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProductOrderedType))
      ),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(PaymentInputType),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLID),
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  },
  resolve: async (parent, args) => {
    try {
      let order = new Order(args)
      order = await order.save()
      return order
    } catch (err) {
      console.log('Error occurred in saving order: ', err)
      throw err
    }
  },
}

const cancelOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const cancelledOrder = await Order.findByIdAndRemove(args.id)
      return cancelledOrder
    } catch (err) {
      console.log('Error occurred in cancelling order: ', err)
      throw err
    }
  },
}

const updateOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    products: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProductOrderedType))
      ),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(PaymentInputType),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const order = await Order.findByIdAndUpdate(args.id, args, { new: true })
      return order
    } catch (err) {
      console.log('Error occurred in updating order: ', err)
      throw err
    }
  },
}

export { addOrder, cancelOrder, updateOrder }
