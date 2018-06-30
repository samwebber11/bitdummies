/* eslint-env jest */

import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql'

import AddressType from '../../graphql/types/AddressType'

describe('Address', () => {
  it('Should have a non-nullable id field of type ID', () => {
    expect(AddressType.getFields()).toHaveProperty('id')
    expect(AddressType.getFields().id.type).toEqual(
      new GraphQLNonNull(GraphQLID)
    )
  })

  it('Should have a non-nullable address1 field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('address1')
    expect(AddressType.getFields().address1.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have an address2 field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('address2')
    expect(AddressType.getFields().address2.type).toEqual(GraphQLString)
  })

  it('Should have a landmark field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('landmark')
    expect(AddressType.getFields().landmark.type).toEqual(GraphQLString)
  })

  it('Should have a non-nullable city field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('city')
    expect(AddressType.getFields().city.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable state field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('state')
    expect(AddressType.getFields().state.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable zip field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('zip')
    expect(AddressType.getFields().zip.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable country field of type String', () => {
    expect(AddressType.getFields()).toHaveProperty('country')
    expect(AddressType.getFields().country.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
