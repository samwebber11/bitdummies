import { GraphQLID, GraphQLList } from 'graphql'

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

export { address }
