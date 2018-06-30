/* eslint-env jest */

import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql'

import ProductOrderedInputType from '../../graphql/types/ProductOrderedInputType'

describe('ProductOrderedInput', () => {
  it('Should be an InputObject type', () => {
    expect(ProductOrderedInputType).toBeInstanceOf(GraphQLInputObjectType)
  })

  it('Should have a non-nullable product field of type ID', () => {
    expect(ProductOrderedInputType.getFields()).toHaveProperty('product')
    expect(ProductOrderedInputType.getFields().product.type).toEqual(
      new GraphQLNonNull(GraphQLID)
    )
  })

  it('Should have a non-nullable quantity field of type Int', () => {
    expect(ProductOrderedInputType.getFields()).toHaveProperty('quantity')
    expect(ProductOrderedInputType.getFields().quantity.type).toEqual(
      new GraphQLNonNull(GraphQLInt)
    )
  })

  it('Should have a non-nullable size field of type String', () => {
    expect(ProductOrderedInputType.getFields()).toHaveProperty('size')
    expect(ProductOrderedInputType.getFields().size.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
