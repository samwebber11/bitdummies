/* eslint-env jest */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql'

import PaymentInputType from '../../graphql/types/PaymentInputType'

describe('PaymentInput', () => {
  it('Should be an InputObject type', () => {
    expect(PaymentInputType).toBeInstanceOf(GraphQLInputObjectType)
  })

  it('Should have a non-nullable status field of type String', () => {
    expect(PaymentInputType.getFields()).toHaveProperty('status')
    expect(PaymentInputType.getFields().status.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable mode field of type String', () => {
    expect(PaymentInputType.getFields()).toHaveProperty('mode')
    expect(PaymentInputType.getFields().mode.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable transactionID field of type String', () => {
    expect(PaymentInputType.getFields()).toHaveProperty('transactionID')
    expect(PaymentInputType.getFields().transactionID.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
