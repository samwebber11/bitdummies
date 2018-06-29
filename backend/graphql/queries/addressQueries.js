import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql'

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

export { address }
