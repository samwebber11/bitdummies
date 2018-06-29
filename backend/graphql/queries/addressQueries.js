import {
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import AddressType from '../types/AddressType'
import OrderByType from '../types/OrderByType'
import Address from '../../database/models/address'

// Fetch all addresses (can be filtered).
const addresses = {
  type: new GraphQLList(AddressType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortAddressBy',
        fields: {
          country: {
            type: OrderByType,
          },
        },
      }),
    },
    filters: {
      type: new GraphQLInputObjectType({
        name: 'FilterAddressesBy',
        fields: {
          city: {
            type: GraphQLString,
          },
          state: {
            type: GraphQLString,
          },
          zip: {
            type: GraphQLString,
          },
          country: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const addressesList = await Address.find(args.filters).sort(args.orderBy)
      return addressesList
    } catch (err) {
      console.log('Error occurred in fetching addresses: ', err)
      throw err
    }
  },
}

// Fetch address by its ID.
const address = {
  type: AddressType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const addressStored = await Address.findById(args.id)
      return addressStored
    } catch (err) {
      console.log('Error occurred in fetching address by ID: ', err)
      throw err
    }
  },
}

export { address, addresses }
