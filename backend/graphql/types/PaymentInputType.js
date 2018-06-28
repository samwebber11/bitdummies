import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from 'graphql'

const PaymentInputType = new GraphQLInputObjectType({
  name: 'PaymentInputType',
  fields: {
    transactionID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mode: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export default PaymentInputType
