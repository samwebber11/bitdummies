import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'

import AddressType from '../types/AddressType'
import {
  addAddressResolver,
  removeAddressResolver,
  updateAddressResolver,
} from '../resolvers/mutations/addressResolvers'

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
  type: new GraphQLList(AddressType),
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
  resolve: updateAddressResolver,
}

export { addAddress, updateAddress, removeAddress }
