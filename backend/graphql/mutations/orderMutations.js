import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'
import GraphQLDate from 'graphql-date'

import Order from '../../database/models/order'
import OrderType from '../types/OrderType'
import ProductInputType from '../types/ProductInputType'
import PaymentInputType from '../types/PaymentInputType'

const addOrder = {
  type: OrderType,
  args: {
    product: {
      type: new GraphQLNonNull(new GraphQLList(ProductInputType)),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(new GraphQLList(PaymentInputType)),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  },
  resolve: (parent, args) => {
    const order = new Order(args)
    const savedOrder = order.save()
    if (!savedOrder) {
      throw new Error('Error')
    }
    return savedOrder
  },
}

const cancelOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (parent, args) => {
    const cancel = Order.findByIdAndRemove(args.id).exec()
    if (!cancel) {
      throw new Error('Error')
    }
    return cancel
  },
}

const updateOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    product: {
      type: new GraphQLNonNull(new GraphQLList(ProductInputType)),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(new GraphQLList(PaymentInputType)),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  },
  resolve: (parent, args) => {
    Order.findByIdAndUpdate(
      args.id,
      {
        $set: {
          product: args.product,
          payment: args.payment,
          status: args.status,
          shippingAddress: args.shippingAddress,
          orderedAt: args.orderedAt,
        },
      },
      { new: true }
    ).catch(err => new Error(err))
  },
}

export { addOrder, cancelOrder, updateOrder }
