/* eslint-env jest */

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql'

import ProductOrderedType from '../../graphql/types/ProductOrderedType'
import ProductType from '../../graphql/types/ProductType'

describe('ProductOrdered', () => {
  it('Should have a non-nullable product field of type ProductType', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('product')
    expect(ProductOrderedType.getFields().product.type).toEqual(
      new GraphQLNonNull(ProductType)
    )
  })

  it('Should have a non-nullable size field of type String', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('size')
    expect(ProductOrderedType.getFields().size.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable quantity field of type Int', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('quantity')
    expect(ProductOrderedType.getFields().quantity.type).toEqual(
      new GraphQLNonNull(GraphQLInt)
    )
  })

  it('Should have a non-nullable actualPrice field of type Float', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('actualPrice')
    expect(ProductOrderedType.getFields().actualPrice.type).toEqual(
      new GraphQLNonNull(GraphQLFloat)
    )
  })

  it('Should have a non-nullable discount field of type Int', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('discount')
    expect(ProductOrderedType.getFields().discount.type).toEqual(
      new GraphQLNonNull(GraphQLInt)
    )
  })

  it('Should have a non-nullable discountedPrice field of type Float', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('discountedPrice')
    expect(ProductOrderedType.getFields().discountedPrice.type).toEqual(
      new GraphQLNonNull(GraphQLFloat)
    )
  })

  it('Should have a non-nullable tax field of type Float', () => {
    expect(ProductOrderedType.getFields()).toHaveProperty('tax')
    expect(ProductOrderedType.getFields().tax.type).toEqual(
      new GraphQLNonNull(GraphQLFloat)
    )
  })
})
