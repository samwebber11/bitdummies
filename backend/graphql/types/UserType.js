import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql'

import Address from '../../database/models/address'
import Order from '../../database/models/order'
import UserInputType from './UserInputType'
import AddressType from './AddressType'
import OrderType from './OrderType'

const UserType = new GraphQLObjectType({
  name: 'Users',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    provider: {
      type: new GraphQLNonNull(UserInputType),
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
      type: AddressType,
      resolve: async (parent, args) => {
        try {
          const address = await Address.findById(parent.address)
          return address
        } catch (err) {
          console.log('Error in fetching address: ', err)
        }
      },
    },
    order: {
      type: OrderType,
      resolve: async (parent, args) => {
        try {
          const order = await Order.findById(parent.order)
          return order
        } catch (err) {
          console.log('Error in Fetching Orders for the user: ', err)
        }
      },
    },
  },
})

export default UserType
