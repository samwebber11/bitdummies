import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import Address from '../../database/models/address'
import User from '../../database/models/user'
import AddressType from '../types/AddressType'
import { forEach } from 'iterall'

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
    // console.log('Starting address')
    // console.log(context.user.id)
    if (context.user) {
      // Fetching the user_id from the user Object
      const userId = context.user._id
      try {
        // Find out if the user exists.
        let user = await User.findById(userId) // Replace userId with ID from context.
        if (!user) {
          throw new Error('Could not find user')
        }
        // If user exists, save the address to the database.
        const addressIds = user.map(address => address.address)
        if (addressIds.length === 3) {
          throw new Error('Error saving more address')
        }
        let address = new Address(args)
        address = await address.save()
        if (!address) {
          throw new Error('Error occurred in saving address')
        }

        // Then add the address ID to the list of addresses for the current user.
        // ... spread operator used
        const addresses = [...user.address, address._id]
        user = await User.findByIdAndUpdate(userId, { address: addresses })
        if (!user) {
          throw new Error('Could not update address in User model')
        }

        return address
      } catch (err) {
        console.log('Error occurred in adding address: ', err)
        throw err
      }
    }
    // TODO: Get user from the context and the user ID. Temporary solution given below.
    // const userId = '5b34e3d5914e3aa7a1114139' // This ID is a valid ID but not a valid userID. Find some other solution for it.
  },
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
