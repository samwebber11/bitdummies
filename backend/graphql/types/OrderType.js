import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
} from 'graphql'
import GraphQLDate from 'graphql-date'

import Address from '../../database/models/address'
import PaymentType from './PaymentType'
import AddressType from './AddressType'
import ProductOrderedType from './ProductOrderedType'

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
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
      type: new GraphQLNonNull(PaymentType),
    },
    shippingAddress: {
      type: new GraphQLNonNull(AddressType),
      resolve: async (parent, args) => {
        try {
          const address = await Address.findById(parent.shippingAddress)
          return address
        } catch (err) {
          console.log('Error in fetching address for order: ', err)
          throw err
        }
      },
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
    total: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
})

export default OrderType
