import {
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import AddressType from '../types/AddressType'
import OrderByType from '../types/OrderByType'
import {
  addressesResolver,
  addressResolver,
} from '../resolvers/queries/addressResolvers'

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
  resolve: addressesResolver,
}

// Fetch address by its ID.
const address = {
  type: AddressType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: addressResolver,
}

export { addresses, address }
