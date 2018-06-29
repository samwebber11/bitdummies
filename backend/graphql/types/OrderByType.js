/**
 * Defines a type for the object passed into the `orderBy` field of some queries.
 * Can only contain values asc and desc.
 */

import { GraphQLEnumType } from 'graphql'

const OrderByType = new GraphQLEnumType({
  name: 'OrderBy',
  values: {
    asc: { value: 1 },
    desc: { value: -1 },
  },
})

export default OrderByType
