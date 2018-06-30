/* eslint-env jest */

import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString } from 'graphql'
import GraphQLDate from 'graphql-date'

import OrderType from '../../graphql/types/OrderType'
import ProductOrderedType from '../../graphql/types/ProductOrderedType'
import PaymentType from '../../graphql/types/PaymentType'
import AddressType from '../../graphql/types/AddressType'

describe('Order', () => {
  it('Should have a non-nullable id field of type ID', () => {
    expect(OrderType.getFields()).toHaveProperty('id')
    expect(OrderType.getFields().id.type).toEqual(new GraphQLNonNull(GraphQLID))
  })

  it('Should have a non-nullable products field of type list(ProductOrdered)', () => {
    expect(OrderType.getFields()).toHaveProperty('products')
    expect(OrderType.getFields().products.type).toEqual(
      new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProductOrderedType))
      )
    )
  })

  it('Should have a non-nullable status field of type String', () => {
    expect(OrderType.getFields()).toHaveProperty('status')
    expect(OrderType.getFields().status.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable payment field of type PaymentType', () => {
    expect(OrderType.getFields()).toHaveProperty('payment')
    expect(OrderType.getFields().payment.type).toEqual(
      new GraphQLNonNull(PaymentType)
    )
  })

  it('Should have a non-nullable shippingAddress field of type AddressType', () => {
    expect(OrderType.getFields()).toHaveProperty('shippingAddress')
    expect(OrderType.getFields().shippingAddress.type).toEqual(
      new GraphQLNonNull(AddressType)
    )
  })

  it('Should have a non-nullable orderedAt field of type Date', () => {
    expect(OrderType.getFields()).toHaveProperty('orderedAt')
    expect(OrderType.getFields().orderedAt.type).toEqual(
      new GraphQLNonNull(GraphQLDate)
    )
  })
})
