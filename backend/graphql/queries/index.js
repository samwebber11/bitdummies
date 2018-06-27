import { GraphQLObjectType } from 'graphql'

import { products, product } from './productQueries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    products,
    product,
  },
})

export default RootQuery
