import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import Address from '../../database/models/address'
import User from '../../database/models/user'
import AddressType from '../types/AddressType'

import { addAddressResolver } from '../resolvers/addressResolvers'

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
  resolve: async (parent, args, context) => {
    if (context.user) {
      const userId = context.user._id
      try {
        let user = User.findById(userId)
        if (!user) {
          throw new Error('Could not find user')
        }
        // Mapping all the addressIds associated with a particular user to have a check if there
        // is any address associated with the user. If no address is found then an error occurs otherwise
        // check the following address in the list of addresses.
        const addressIds = user.map(address => address.address)
        if (addressIds.length === 0) {
          throw new Error(
            'Could not find any address associated with the current user'
          )
        }
        addressIds.forEach(async address => {
          if (user.order.shippingAddress._id === address) {
            if (
              user.order.status === 'Delivered' ||
              user.order.status === 'On Its Way' ||
              user.order.status === 'Delivered'
            ) {
              throw new Error('Cannot remove address')
            }
          }
        })

        // TODO: Check if this functions works right away
        const id = args.id.valueOf()
        const removeaddress = await Address.findByIdAndRemove(args.id)
        if (!removeaddress) {
          throw new Error('Error occured in removing address')
        }
        user = await User.findByIdAndUpdate(userId, {
          address: addressIds.splice(addressIds.indexOf(id), 1),
        })
        // const dbAddress = await User.find((args.id: { $in: addressIds }))

        return removeaddress
      } catch (err) {
        console.log('Error occured in removing address: ', err)
        throw err
      }
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
