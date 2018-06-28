import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
} from 'graphql'
import { GraphQLDate } from 'graphql-date'

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    product: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'products',
          fields: {
            id: {
              type: new GraphQLNonNull(GraphQLID),
            },
            quantity: {
              type: GraphQLInt,
            },
            actualPrice: {
              type: GraphQLFloat,
            },
            tax: {
              type: GraphQLFloat,
            },
            discount: {
              type: GraphQLInt,
            },
            discountedPrice: {
              type: GraphQLFloat,
            },
            size: {
              type: GraphQLString,
            },
          },
        })
      ),
    },
    status: {
      type: GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'payments',
          fields: {
            transactionID: {
              type: new GraphQLNonNull(GraphQLID),
            },
            status: {
              type: GraphQLString,
            },
            mode: {
              type: GraphQLString,
            },
          },
        })
      ),
    },
    shippingAddress: {
      type: GraphQLString,
    },
    orderedAt: {
      type: GraphQLDate,
    },
  }),
})

export default OrderType
