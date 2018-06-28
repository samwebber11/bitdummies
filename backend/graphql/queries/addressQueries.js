import { GraphQLID, GraphQLList } from 'graphql'

import AddressType from '../types/AddressType'
import Address from '../../database/models/address'

const addresses = {
  type: new GraphQLList(AddressType),
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (parent, args) => {
    try {
      const AddressStored = await Address.findById(args.id)
      return AddressStored
    } catch (err) {
      console.log('Error Fetching Address')
    }
  },
}

export default addresses


