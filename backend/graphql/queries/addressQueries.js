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
import User from '../../database/models/user'
import { QUERY_ADDRESS, QUERY_ADDRESSES } from '../../database/operations'

import AppError from '../../Errors/error'
import AuthError from '../../Errors/authError'
import PermitError from '../../Errors/permitError'

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
  resolve: async (parent, args, context) => {
    const { user } = context
    if (!user) {
      throw new AuthError()
    }
    try {
      if (!user.isAuthorizedTo(QUERY_ADDRESSES)) {
        throw new PermitError()
      }
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
  resolve: async (parent, args, context) => {
    const { user } = context
    if (!user) {
      throw new AuthError()
    }
    try {
      if (!user.isAuthorizedTo(QUERY_ADDRESS)) {
        throw new PermitError()
      }
      const addressStored = await Address.findById(args.id)
      return addressStored
    } catch (err) {
      console.log('Error occurred in fetching address by ID: ', err)
      throw err
    }
  },
}

export { address, addresses }
