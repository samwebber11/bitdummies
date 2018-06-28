import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType
} from 'graphql'
import { GraphQLDate } from 'graphql-date'

import OrderType from '../types/OrderType'
import Order from '../../database/models/order'

const orders = {
  type: new GraphQLList(OrderType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'OrderedList',
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
      const OrderList = await Order.find({}).sort(args.orderBy)
      return OrderList
    } catch (err) {
      console.log('Error occured in fetching products', err)
    }
  },
}

// Fetch According to Date On which Product was ordered
// const Order_Fetch = {
//   type: new GraphQLList(OrderType),
//   args: {
//     orderBy: {
//       type: new GraphQLInputObjectType({
//         name: 'OrderedProductSorted',
//         fields: {
//           product: {
//             type: new GraphQLList(
//               new GraphQLInputObjectType({
//                 name: 'Products',
//                 fields: {
//                   productOrderedAt: {
//                     type: GraphQLDate,
//                   },
//                 },
//               })
//             ),
//           },
//         },
//       }),
//     },
//   },
//   resolve: async(parent, args) => {
//     try{
//       const orderedProductList= await Order.find({}).sort(args.orderBy)
//       return orderedProductList
//     } catch(err) {
//       console.log('Error occured in fetching products ',err)
//     }
//   },
// }



const Orders = {
  type: Order,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    try {
      const orderPlaced = await Order.findById(args.id)
      return orderPlaced
    } catch (err) {
      console.log('Error fetching order')
    }
  },
}

export { Orders, orders }
