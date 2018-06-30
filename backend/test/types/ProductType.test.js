/* eslint-env jest */

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
} from 'graphql'

import ProductType from '../../graphql/types/ProductType'
import SizeType from '../../graphql/types/SizeType'

describe('Product', () => {
  it('Should have a non-nullable id field of type ID', () => {
    expect(ProductType.getFields()).toHaveProperty('id')
    expect(ProductType.getFields().id.type).toEqual(
      new GraphQLNonNull(GraphQLID)
    )
  })

  it('Should have a non-nullable id field of type ID', () => {
    expect(ProductType.getFields()).toHaveProperty('id')
    expect(ProductType.getFields().id.type).toEqual(
      new GraphQLNonNull(GraphQLID)
    )
  })

  it('Should have a non-nullable name field of type String', () => {
    expect(ProductType.getFields()).toHaveProperty('name')
    expect(ProductType.getFields().name.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable category field of type String', () => {
    expect(ProductType.getFields()).toHaveProperty('category')
    expect(ProductType.getFields().category.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable size field of type List(SizeType)', () => {
    expect(ProductType.getFields()).toHaveProperty('size')
    expect(ProductType.getFields().size.type).toEqual(
      new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SizeType)))
    )
  })

  it('Should have a non-nullable description field of type String', () => {
    expect(ProductType.getFields()).toHaveProperty('description')
    expect(ProductType.getFields().description.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable actualPrice field of type Float', () => {
    expect(ProductType.getFields()).toHaveProperty('actualPrice')
    expect(ProductType.getFields().actualPrice.type).toEqual(
      new GraphQLNonNull(GraphQLFloat)
    )
  })

  it('Should have a non-nullable discount field of type Int', () => {
    expect(ProductType.getFields()).toHaveProperty('discount')
    expect(ProductType.getFields().discount.type).toEqual(
      new GraphQLNonNull(GraphQLInt)
    )
  })

  it('Should have a non-nullable discountedPrice field of type Float', () => {
    expect(ProductType.getFields()).toHaveProperty('discountedPrice')
    expect(ProductType.getFields().discountedPrice.type).toEqual(
      new GraphQLNonNull(GraphQLFloat)
    )
  })

  it('Should have a non-nullable tax field of type Float', () => {
    expect(ProductType.getFields()).toHaveProperty('tax')
    expect(ProductType.getFields().tax.type).toEqual(
      new GraphQLNonNull(GraphQLFloat)
    )
  })

  it('Should have a non-nullable imagePath field of type List(String)', () => {
    expect(ProductType.getFields()).toHaveProperty('imagePath')
    expect(ProductType.getFields().imagePath.type).toEqual(
      new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    )
  })

  it('Should have a non-nullable delicacy field of type String', () => {
    expect(ProductType.getFields()).toHaveProperty('delicacy')
    expect(ProductType.getFields().delicacy.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
