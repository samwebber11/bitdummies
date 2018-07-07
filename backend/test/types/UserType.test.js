/* eslint-env jest */

import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'

import UserType from '../../graphql/types/UserType'
import UserProviderType from '../../graphql/types/UserProviderType'
import AddressType from '../../graphql/types/AddressType'
import OrderType from '../../graphql/types/OrderType'

describe('User', () => {
  it('Should have a non-nullable id field of type ID', () => {
    expect(UserType.getFields()).toHaveProperty('id')
    expect(UserType.getFields().id.type).toEqual(new GraphQLNonNull(GraphQLID))
  })

  it('Should have a non-nullable provider field of type UserProviderType', () => {
    expect(UserType.getFields()).toHaveProperty('provider')
    expect(UserType.getFields().provider.type).toEqual(
      new GraphQLNonNull(UserProviderType)
    )
  })

  it('Should have a non-nullable email field of type String', () => {
    expect(UserType.getFields()).toHaveProperty('email')
    expect(UserType.getFields().email.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable firstName field of type String', () => {
    expect(UserType.getFields()).toHaveProperty('firstName')
    expect(UserType.getFields().firstName.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable lastName field of type String', () => {
    expect(UserType.getFields()).toHaveProperty('lastName')
    expect(UserType.getFields().lastName.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a phone field of type String', () => {
    expect(UserType.getFields()).toHaveProperty('phone')
    expect(UserType.getFields().phone.type).toEqual(GraphQLString)
  })

  it('Should have an address field of type List(AddressType)', () => {
    expect(UserType.getFields()).toHaveProperty('address')
    expect(UserType.getFields().address.type).toEqual(
      new GraphQLList(AddressType)
    )
  })

  it('Should have an order field of type List(OrderType)', () => {
    expect(UserType.getFields()).toHaveProperty('order')
    expect(UserType.getFields().order.type).toEqual(
      new GraphQLNonNull(OrderType)
    )
  })

  it('Should have a roles field of type List(String)', () => {
    expect(UserType.getFields()).toHaveProperty('roles')
    expect(UserType.getFields().roles.type).toEqual(
      new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    )
  })
})
