import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { queryProductType } from './queries/queries'
import mutation from './mutations/index'

exports.productSchema = new GraphQLSchema({
  query: queryProductType,
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutation,
  }),
})
