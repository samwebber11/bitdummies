/* eslint-env jest */

import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from 'graphql'

import SizeInputType from '../../graphql/types/SizeInputType'

describe('SizeInput', () => {
  it('Should be an InputObject type', () => {
    expect(SizeInputType).toBeInstanceOf(GraphQLInputObjectType)
  })

  it('Should have a non-nullable label field of type String', () => {
    expect(SizeInputType.getFields()).toHaveProperty('label')
    expect(SizeInputType.getFields().label.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable quantityAvailable field of type Int', () => {
    expect(SizeInputType.getFields()).toHaveProperty('quantityAvailable')
    expect(SizeInputType.getFields().quantityAvailable.type).toEqual(
      new GraphQLNonNull(GraphQLInt)
    )
  })
})
