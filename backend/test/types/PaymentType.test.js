/* eslint-env jest */

import { GraphQLNonNull, GraphQLString } from 'graphql'

import PaymentType from '../../graphql/types/PaymentType'

describe('Payment', () => {
  it('Should have a non-nullable status field of type String', () => {
    expect(PaymentType.getFields()).toHaveProperty('status')
    expect(PaymentType.getFields().status.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable mode field of type String', () => {
    expect(PaymentType.getFields()).toHaveProperty('mode')
    expect(PaymentType.getFields().mode.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable transactionID field of type String', () => {
    expect(PaymentType.getFields()).toHaveProperty('transactionID')
    expect(PaymentType.getFields().transactionID.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
