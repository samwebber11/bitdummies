import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import Address from '../../database/models/address'
import User from '../../database/models/user'
import AddressType from '../types/AddressType'

import {
  addAddressResolver,
  removeAddressResolver,
} from '../resolvers/addressResolvers'

const addAddress = {
  type: AddressType,
  args: {
    address1: {
      type: new GraphQLNonNull(GraphQLString),
    },
    address2: {
      type: GraphQLString,
    },
    landmark: {
      type: GraphQLString,
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    state: {
      type: new GraphQLNonNull(GraphQLString),
    },
    zip: {
      type: new GraphQLNonNull(GraphQLString),
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: addAddressResolver,
}

const removeAddress = {
  type: AddressType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: removeAddressResolver,
}

const updateAddress = {
  type: AddressType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    address1: {
      type: new GraphQLNonNull(GraphQLString),
    },
    address2: {
      type: GraphQLString,
    },
    landmark: {
      type: GraphQLString,
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    state: {
      type: new GraphQLNonNull(GraphQLString),
    },
    zip: {
      type: new GraphQLNonNull(GraphQLString),
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (parent, args, context) => {
    if (context.user) {
      const userId = context.user._id
      try {
        const user = User.findById(userId)
        if (!user) {
          throw new Error('No user is found with this id')
        }
        // Checking if the address id exists in the id lists of the user.
        // if found no id then it will throw an error otherwise update the
        // address at that place.
        const addressIds = user.map(address => address.address)
        const dbAddress = await User.find({ args: { $in: addressIds } })
        if (dbAddress.length !== 1) {
          throw new Error('Address is not present in the database')
        }
        const address = await Address.findByIdAndUpdate(
          args.id,
          {
            $set: {
              address1: args.address1,
              address2: args.address2,
              landmark: args.landmark,
              city: args.city,
              state: args.state,
              zip: args.zip,
              country: args.country,
            },
          },
          { new: true }
        )
        return address
      } catch (err) {
        console.log('Error occurred in updating address: ', err)
        throw err
      }
    }
  },
}

export { addAddress, updateAddress, removeAddress }
