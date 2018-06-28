<<<<<<< HEAD
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql'
=======
import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
import GraphQLDate from 'graphql-date'

import Order from '../../database/models/order'
import OrderType from '../types/OrderType'
import ProductInputType from '../types/ProductInputType'
import PaymentInputType from '../types/PaymentInputType'

const addOrder = {
  type: OrderType,
  args: {
    product: {
<<<<<<< HEAD
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLInputObjectType({
            name: 'AddProduct',
            fields: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
              quantity: {
                type: new GraphQLNonNull(GraphQLInt),
              },
              actualPrice: {
                type: new GraphQLNonNull(GraphQLFloat),
              },
              tax: {
                type: new GraphQLNonNull(GraphQLFloat),
              },
              discount: {
                type: new GraphQLNonNull(GraphQLInt),
              },
              discountedPrice: {
                type: new GraphQLNonNull(GraphQLFloat),
              },
              size: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
          })
        )
      ),
=======
      type: new GraphQLNonNull(new GraphQLList(ProductInputType)),
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
<<<<<<< HEAD
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'AddPayment',
            fields: {
              transactionID: {
                type: new GraphQLNonNull(GraphQLID),
              },
              status: {
                type: new GraphQLNonNull(GraphQLString),
              },
              mode: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
          })
        )
      ),
=======
      type: new GraphQLNonNull(new GraphQLList(PaymentInputType)),
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
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
<<<<<<< HEAD
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLInputObjectType({
            name: 'UpdateProduct',
            fields: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
              quantity: {
                type: new GraphQLNonNull(GraphQLInt),
              },
              actualPrice: {
                type: new GraphQLNonNull(GraphQLFloat),
              },
              tax: {
                type: new GraphQLNonNull(GraphQLFloat),
              },
              discount: {
                type: new GraphQLNonNull(GraphQLInt),
              },
              discountedPrice: {
                type: new GraphQLNonNull(GraphQLFloat),
              },
              size: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
          })
        )
      ),
=======
      type: new GraphQLNonNull(new GraphQLList(ProductInputType)),
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
<<<<<<< HEAD
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLObjectType({
            name: 'UpdatePayment',
            fields: {
              transactionID: {
                type: new GraphQLNonNull(GraphQLID),
              },
              status: {
                type: new GraphQLNonNull(GraphQLString),
              },
              mode: {
                type: new GraphQLNonNull(GraphQLString),
              },
            },
          })
        )
      ),
=======
      type: new GraphQLNonNull(new GraphQLList(PaymentInputType)),
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  },
<<<<<<< HEAD
  resolve: (parent, args) =>
=======
  resolve: (parent, args) => {
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
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
<<<<<<< HEAD
    ).catch(err => new Error(err)),
=======
    ).catch(err => new Error(err))
  },
>>>>>>> 5553a658dcf99f5fffd5e91a28fcf00e224bdf99
}

export { addOrder, cancelOrder, updateOrder }
