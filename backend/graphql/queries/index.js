import { GraphQLObjectType } from 'graphql'

import products from './productQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
  },
})

export default RootQuery
