import {
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql'

import OrderType from '../types/OrderType'
import Order from '../../database/models/order'

const orders = {
  type: new GraphQLList(OrderType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortOrdersBy',
        fields: {
          orderedAt: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const ordersList = await Order.find({}).sort(args.orderBy)
      return ordersList
    } catch (err) {
      console.log('Error occurred in fetching orders: ', err)
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

const order = {
  type: OrderType,
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
      console.log('Error occurred in fetching order by ID: ', err)
    }
  },
}

export { orders, order }
