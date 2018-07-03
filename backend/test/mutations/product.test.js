/* eslint-env jest */

import { ValidationError } from 'mongoose'

import User from '../../database/models/user'
import { addProductResolver } from '../../graphql/resolvers/productResolvers'
import { merge, pick } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addProduct resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
  }

  const dummyProduct = {
    name: 'Handcrafted Plastic Computer',
    category: 'Shoes',
    size: [
      {
        label: 'XS',
        quantityAvailable: 5,
      },
      {
        label: 'M',
        quantityAvailable: 10,
      },
    ],
    description: 'Eum sunt dicta enim animi enim.',
    actualPrice: 984.99,
    discount: 5,
    tax: 12.5,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
    delicacy: 'medium',
  }

  it('Should add a product', async () => {
    expect.assertions(2)
    const savedUser = await User.findById(user._id)
    const product = await addProductResolver(null, dummyProduct, {
      user: savedUser,
    })
    expect(product).toHaveProperty('_id')
    // Hack so as to do a deep comparison of the two objects.
    expect(JSON.parse(JSON.stringify(product))).toMatchObject(dummyProduct)
  })

  it('Should not add a product when there is no user', async () => {
    expect.assertions(1)
    await expect(addProductResolver(null, dummyProduct, {})).rejects.toThrow(
      'Unauthorized'
    )
  })

  it(`Should not add a product when 'required' fields are missing`, async () => {
    expect.assertions(1)
    // Name is going to be missing.
    const incompleteProduct = pick(dummyProduct, [
      'category',
      'size',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'imagePath',
      'delicacy',
    ])
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, incompleteProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product when 'category' is invalid`, async () => {
    expect.assertions(1)
    const invalidCategoryProduct = merge(dummyProduct, {
      category: 'Designer THX',
    })
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidCategoryProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product with an empty 'size' array`, async () => {
    expect.assertions(1)
    const invalidSizeProduct = merge(dummyProduct, { size: [] })
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidSizeProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product when 'size' field is missing`, async () => {
    expect.assertions(1)
    const invalidSizeProduct = pick(dummyProduct, [
      'name',
      'category',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'imagePath',
      'delicacy',
    ])
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidSizeProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product when 'size' field has objects with duplicate labels`, async () => {
    expect.assertions(1)
    const invalidSizeProduct = merge(dummyProduct, {
      size: [
        { label: 'XL', quantityAvailable: 5 },
        { label: 'S', quantityAvailable: 10 },
        { label: 'XL', quantityAvailable: 8 },
      ],
    })
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidSizeProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product when 'size' field has objects with invalid quantity`, async () => {
    expect.assertions(1)
    const invalidSizeProduct = merge(dummyProduct, {
      size: [
        { label: 'XL', quantityAvailable: 5 },
        { label: 'S', quantityAvailable: -15 },
      ],
    })
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidSizeProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should add a product when 'description' field is missing`, async () => {
    expect.assertions(4)
    const validProduct = pick(dummyProduct, [
      'name',
      'category',
      'size',
      'actualPrice',
      'discount',
      'tax',
      'imagePath',
      'delicacy',
    ])
    const savedUser = await User.findById(user._id)
    const savedProduct = await addProductResolver(null, validProduct, {
      user: savedUser,
    })
    expect(savedProduct).toHaveProperty('_id')
    expect(savedProduct).toHaveProperty('description')
    expect(savedProduct.description).toEqual(
      'A very little short description of the searched product is available.'
    )
    expect(JSON.parse(JSON.stringify(savedProduct))).toMatchObject(
      merge(validProduct, {
        description:
          'A very little short description of the searched product is available.',
      })
    )
  })

  it(`Should add a product when 'discount', 'tax' and 'delicacy' fields are missing`, async () => {
    expect.assertions(7)
    const validProduct = pick(dummyProduct, [
      'name',
      'category',
      'size',
      'actualPrice',
      'imagePath',
    ])
    const savedUser = await User.findById(user._id)
    const savedProduct = await addProductResolver(null, validProduct, {
      user: savedUser,
    })
    expect(savedProduct).toHaveProperty('_id')
    expect(savedProduct).toHaveProperty('discount')
    expect(savedProduct).toHaveProperty('tax')
    expect(savedProduct).toHaveProperty('delicacy')
    expect(savedProduct.discount).toBe(0)
    expect(savedProduct.tax).toBe(5)
    expect(savedProduct.delicacy).toBe('high')
  })

  it(`Should not add a product with an empty 'imagePath' array`, async () => {
    expect.assertions(1)
    const invalidSizeProduct = merge(dummyProduct, { size: [] })
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidSizeProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product when 'imagePath' field is missing`, async () => {
    expect.assertions(1)
    const invalidImageProduct = pick(dummyProduct, [
      'name',
      'category',
      'size',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'delicacy',
    ])
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, invalidImageProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it(`Should not add a product when 'imagePath' field has more than 5 images`, async () => {
    expect.assertions(1)
    const tooManyImagesProduct = merge(dummyProduct, {
      imagePath: [
        ...dummyProduct.imagePath,
        'Qui quis necessitatibus et eius',
        'Possimus laudantium tenetur eligendi rerum et deserunt illo et eveniet',
        'Fuga qui adipisci et qui',
      ],
    })
    const savedUser = await User.findById(user._id)
    await expect(
      addProductResolver(null, tooManyImagesProduct, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })
})
