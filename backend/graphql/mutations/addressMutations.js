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
      type: new GraphQLNonNull(GraphQLString),
    },
    landmark: {
      type: new GraphQLNonNull(GraphQLString),
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
  resolve: (parent, args) => {
    const address = new Address(args)
    const saveAddress = address.save()
    if (!saveAddress) {
      throw new Error('Error')
    }
    return saveAddress
  },
}

const removeAddress = {
  type: AddressType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (parent, args) => {
    const remove = Address.findByIdAndRemove(args.id).exec()
    if (!remove) {
      throw new Error('Error')
    }
    return remove
  },
}

const updateAddress = {
  type: AddressType,
  args: {
    address1: {
      type: new GraphQLNonNull(GraphQLString),
    },
    address2: {
      type: new GraphQLNonNull(GraphQLString),
    },
    landmark: {
      type: new GraphQLNonNull(GraphQLString),
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
  resolve: (parent, args) => {
    Address.findByIdAndUpdate(
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
    ).catch(err => new Error(err))
  },
}

export { addAddress, updateAddress, removeAddress }
