import {
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql'

import AddressType from '../types/AddressType'
import Address from '../../database/models/address'

const address = {
  type: new GraphQLList(AddressType),
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    try {
      const addressStored = await Address.findById(args.id)
      return addressStored
    } catch (err) {
      console.log('Error occurred in fetching address by ID: ', err)
    }
  },
}

const addresses = {
  type: new GraphQLList(AddressType),
  args: {
    orderBy: {
      type: new GraphQLInputObjectType({
        name: 'SortAddress',
        fields: {
          country: {
            type: GraphQLString,
          },
        },
      }),
    },
  },
  resolve: async (parent, args) => {
    try {
      const addressList = await Address.find({}).sort(args.orderBy)
      return addressList
    } catch (err) {
      console.log('Error occurred in fetching products: ', err)
    }
  },
}
export { address, addresses }
