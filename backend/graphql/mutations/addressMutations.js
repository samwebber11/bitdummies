import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import Address from '../../database/models/address'
import User from '../../database/models/user'
import AddressType from '../types/AddressType'

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
  resolve: async (parent, args, context) => {
    console.log(context)
    // TODO: Get user from the context and the user ID. Temporary solution given below.
    const userId = '5b34e3d5914e3aa7a1114139' // This ID is a valid ID but not a valid userID. Find some other solution for it.
    try {
      // Find out if the user exists.
      let user = await User.findById(userId) // Replace userId with ID from context.
      if (!user) {
        throw new Error('Could not find user')
      }

      // If user exists, save the address to the database.
      let address = new Address(args)
      address = await address.save()
      if (!address) {
        throw new Error('Error occurred in saving address')
      }

      // Then add the address ID to the list of addresses for the current user.
      const addresses = [...user.address, address._id]
      user = await User.findByIdAndUpdate(user._id, { address: addresses })
      if (!user) {
        throw new Error('Could not update address in User model')
      }

      return address
    } catch (err) {
      console.log('Error occurred in adding address: ', err)
      throw err
    }
  },
}

const removeAddress = {
  type: AddressType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const address = await Address.findByIdAndRemove(args.id)
      return address
    } catch (err) {
      console.log('Error occurred in removing address: ', err)
      throw err
    }
  },
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
  resolve: async (parent, args) => {
    try {
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
  },
}

export { addAddress, updateAddress, removeAddress }
