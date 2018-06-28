import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql'
import { GraphQLDate } from 'graphql-date'
import ProductInputType from './ProductInputType'
import PaymentInputType from './PaymentInputType'

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    product: {
      type: new GraphQLList(new GraphQLObjectType(ProductInputType)),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLList(new GraphQLObjectType(PaymentInputType)),
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
