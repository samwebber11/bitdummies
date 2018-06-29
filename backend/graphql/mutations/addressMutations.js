import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import Address from '../../database/models/address'
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
  resolve: async (parent, args) => {
    try {
      let address = new Address(args)
      address = await address.save()
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
