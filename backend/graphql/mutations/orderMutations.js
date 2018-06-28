import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
} from 'graphql'

import Order from '../../database/models/order'
import OrderType from '../types/OrderType'


const addOrder={
  type: OrderType,
  args: {
    product: {
      type: new GraphQLNonNull(
        new GraphQLList(
        new GraphQLInputObjectType({
          name: 'product',
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
            productOrderedAt: {
              type: new GraphQLNonNull(GraphQLDate),
            },
          },
        })
      ),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(
        new GraphQLList(
        new GraphQLObjectType({
          name: 'payment',
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
      ),
    ),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  },
  resolve: (parent,args) => {
    const order=new Order(args)
    const savedOrder= order.save()
    if(!savedOrder) {
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
  resolve: (parent,args) => {
    const cancel = Order.findByIdAndRemove(args.id).exec()
    if(!cancel) {
      throw new Error('Error')
    }
    return cancel
  },
}


const updateOrder = {
  type: OrderType,
  args: {
    id : {
      type: new GraphQLNonNull(GraphQLID),
    },
    product: {
      type: new GraphQLNonNull(
        new GraphQLList(
        new GraphQLInputObjectType({
          name: 'product',
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
            productOrderedAt: {
              type: new GraphQLNonNull(GraphQLDate),
            },
          },
        })
      ),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(
        new GraphQLList(
        new GraphQLObjectType({
          name: 'payment',
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
      ),
    ),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  },
  resolve: (parent,args) => {
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
      {new : true}
    ).catch(err => new Error(err)),
  },
}

export { addOrder,cancelOrder,updateOrder}
