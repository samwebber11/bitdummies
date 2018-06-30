/* eslint-env jest */

import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'

import SizeType from '../../graphql/types/SizeType'

describe('Size', () => {
  it('Should have a non-nullable label field of type String', () => {
    expect(SizeType.getFields()).toHaveProperty('label')
    expect(SizeType.getFields().label.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable quantityAvailable field of type Int', () => {
    expect(SizeType.getFields()).toHaveProperty('quantityAvailable')
    expect(SizeType.getFields().quantityAvailable.type).toEqual(
      new GraphQLNonNull(GraphQLInt)
    )
  })
})
