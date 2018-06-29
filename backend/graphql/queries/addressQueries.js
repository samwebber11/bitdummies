import {
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import AddressType from '../types/AddressType'
import Address from '../../database/models/address'

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
      console.log(addressStored)
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
