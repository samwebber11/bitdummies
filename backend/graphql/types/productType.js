import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql'
import { GraphQLID } from 'graphql'


exports.productType=new GraphQLObjectType({
  name: 'product',
  fields() {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
      name: {
        type: GraphQLString,
      },
      category: {
        type: GraphQLString,
      },
      size: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
      actualPrice: {
        type: GraphQLInt,
      },
      discount: {
        type: GraphQLInt,
      },
      tax: {
        type: GraphQLInt,
      },
      quantityAvailable: {
        type: GraphQLInt,
      },
      delicacy: {
        type: GraphQLString,
      },
    }
  },
})
