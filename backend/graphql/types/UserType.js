import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql'

import Address from '../../database/models/address'
import Order from '../../database/models/order'
import UserProviderType from './UserProviderType'
import AddressType from './AddressType'
import OrderType from './OrderType'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    provider: {
      type: new GraphQLNonNull(UserProviderType),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phone: {
      type: GraphQLString,
    },
    address: {
      type: new GraphQLList(AddressType),
      resolve: async (parent, args) => {
        try {
          const addressList = await Address.find({
            _id: { $in: parent.address },
          })
          return addressList
        } catch (err) {
          console.log('Error in fetching addressList for the user: ', err)
          throw err
        }
      },
    },
    order: {
      type: new GraphQLList(OrderType),
      resolve: async (parent, args) => {
        try {
          const ordersList = await Order.find({ _id: { $in: parent.order } })
          return ordersList
        } catch (err) {
          console.log('Error in fetching orders for the user: ', err)
          throw err
        }
      },
    },
    roles: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
  }),
})

export default UserType
