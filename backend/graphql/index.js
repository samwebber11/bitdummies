import { GraphQLSchema } from 'graphql'

import RootQuery from './queries/'
import Mutation from './mutations/'

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})

export default schema
