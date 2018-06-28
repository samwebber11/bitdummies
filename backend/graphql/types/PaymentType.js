import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: {
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    transactionID: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export default PaymentType
