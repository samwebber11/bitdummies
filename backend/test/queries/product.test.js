/* eslint-env jest */

import { Types, ValidationError } from 'mongoose'

import Product from '../../database/models/product'
import {
  productResolver,
  productsResolver,
} from '../../graphql/resolvers/queries/productResolvers'

import { pick, compareValues } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('products resolver', () => {
  const dummyProduct1 = {
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

  const dummyProduct2 = {
    name: 'Awesome Plastic Pizza',
    category: 'Gloves',
    size: [
      {
        label: 'S',
        quantityAvailable: 5,
      },
      {
        label: 'L',
        quantityAvailable: 10,
      },
      {
        label: 'XL',
        quantityAvailable: 3,
      },
    ],
    description: 'Omnis reiciendis expedita iure consequatur non.',
    actualPrice: 635.61,
    discount: 10,
    tax: 18,
    imagePath: [
      'Voluptatem nostrum autem.',
      'Ut possimus maiores placeat voluptate quam accusantium aut.',
      'Numquam at sed quo autem velit optio.',
      'Quisquam incidunt fugit vel eos at et alias maiores perspiciatis.',
    ],
    delicacy: 'low',
  }

  const dummyProduct3 = {
    name: 'Woven Cap',
    category: 'Hat',
    size: [
      {
        label: 'S',
        quantityAvailable: 5,
      },
      {
        label: 'L',
        quantityAvailable: 7,
      },
    ],
    description: 'Wes Dsack ikni bhun garuop',
    actualPrice: 765.88,
    discount: 10,
    tax: 12.5,
    imagePath: [
      'Optef hubsns wuungus uhngyb',
      'desrt htgf weq unn sybd kbre',
      'indgwt wert yufd qwead hgufn',
    ],
    delicacy: 'high',
  }

  it('Should fetch all products', async () => {
    expect.assertions(18)

    // Setup.
    // const productList = [dummyProduct1, dummyProduct2, dummyProduct3]
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])

    // Actual test begins.
    const fetchedProductList = await productsResolver(null, {})

    expect(fetchedProductList.length).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('name')
    expect(fetchedProductList[0].name).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('category')
    expect(fetchedProductList[0].category).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('description')
    expect(fetchedProductList[0].description).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('actualPrice')
    expect(fetchedProductList[0].actualPrice).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('tax')
    expect(fetchedProductList[0].tax).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('discount')
    expect(fetchedProductList[0]).toHaveProperty('size')
    expect(fetchedProductList[0].size).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('delicacy')
    expect(fetchedProductList[0].delicacy).not.toBeNull()
    expect(fetchedProductList[0]).toHaveProperty('imagePath')
    expect(fetchedProductList[0].imagePath.length).not.toBeNull()

    // CleanUp.
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
  })

  it('Should fetch products order by their name', async () => {
    expect.assertions(3)

    // Setup.
    const productList = [dummyProduct1, dummyProduct2, dummyProduct3]
    productList.sort(compareValues('name', 'asc'))
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])

    // Actual test begins.
    const fetchedProductList = await productsResolver(null, {
      orderBy: { name: 'asc' },
    })
    expect(fetchedProductList.length).toBeGreaterThanOrEqual(productList.length)
    expect(fetchedProductList[0]).toHaveProperty('name')
    expect(fetchedProductList[0].name).toBe(productList[0].name)

    // Cleanup.
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
  })

  it('Should fetch products order by their actual price', async () => {
    expect.assertions(3)

    // Setup.
    const productList = [dummyProduct1, dummyProduct2, dummyProduct3]
    productList.sort(compareValues('actualPrice', 'asc'))
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])

    // Actual test begins.
    const fetchedProductList = await productsResolver(null, {
      orderBy: { actualPrice: 'asc' },
    })
    expect(fetchedProductList.length).toBeGreaterThanOrEqual(productList.length)
    expect(fetchedProductList[0]).toHaveProperty('actualPrice')
    expect(fetchedProductList[0].actualPrice).toBe(productList[0].actualPrice)

    // Cleanup.
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
  })

  it('Should fetch products order by their category', async () => {
    expect.assertions(3)

    // Setup.
    const productList = [dummyProduct1, dummyProduct2, dummyProduct3]
    productList.sort(compareValues('category', 'asc'))
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])

    // Actual test begins.
    const fetchedProductList = await productsResolver(null, {
      orderBy: { category: 'asc' },
    })
    expect(fetchedProductList.length).toBeGreaterThanOrEqual(productList.length)
    expect(fetchedProductList[0]).toHaveProperty('category')
    expect(fetchedProductList[0].category).toBe(productList[0].category)

    // Cleanup.
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
  })

  it('Should fetch products filtered by their category', async () => {
    expect.assertions(3)

    // Setup.
    let productList = [dummyProduct1, dummyProduct2, dummyProduct3]
    productList = productList.filter(val => val.category === 'Hat')
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const arg = pick(products[2], ['category'])

    // Actual test begins.
    const fetchedProductList = await productsResolver(null, {
      filters: arg,
    })
    expect(fetchedProductList.length).toBeGreaterThanOrEqual(productList.length)
    expect(fetchedProductList[0]).toHaveProperty('category')
    expect(fetchedProductList[0].category).toBe(productList[0].category)

    // Cleanup.
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
  })

  it('Should fetch product filtered by their category and sorted by its actualPrice', async () => {
    expect.assertions(5)

    // Setup.
    let productList = [dummyProduct1, dummyProduct2, dummyProduct3]
    productList = productList.filter(val => val.category === 'Hat')
    productList.sort(compareValues('actualPrice', 'asc'))
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const arg = pick(products[2], ['category'])

    // Actual test begins.
    const fetchedProductList = await productsResolver(null, {
      orderBy: { actualPrice: 'asc' },
      filters: arg,
    })
    expect(fetchedProductList[0]).toHaveProperty('actualPrice')
    expect(fetchedProductList[0].actualPrice).toBe(productList[0].actualPrice)
    expect(fetchedProductList.length).toBeGreaterThanOrEqual(productList.length)
    expect(fetchedProductList[0]).toHaveProperty('category')
    expect(fetchedProductList[0].category).toBe(productList[0].category)

    // Cleanup.
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
  })
})

describe('product resolver', () => {
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

  it('Should fetch a product by its id ', async () => {
    expect.assertions(16)

    // Setup.
    const product = await Product.create(dummyProduct)
    const args = { id: product._id }

    // Actual test begins.
    const fetchedProduct = await productResolver(null, args)

    expect(fetchedProduct).toHaveProperty('_id')
    expect(fetchedProduct._id).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('name')
    expect(fetchedProduct.name).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('delicacy')
    expect(fetchedProduct.delicacy).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('size')
    expect(fetchedProduct.size).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('imagePath')
    expect(fetchedProduct.imagePath).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('discount')
    expect(fetchedProduct.discount).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('tax')
    expect(fetchedProduct.tax).not.toBeNull()
    expect(fetchedProduct).toHaveProperty('description')
    expect(fetchedProduct.description).not.toBeNull()

    // CleanUp.
    await Product.findByIdAndRemove(product._id)
  })

  it('Should not fetch a product if the product is not present', async () => {
    expect.assertions(1)

    // Setup.
    const product = await Product.create(dummyProduct)
    const arg = await new Types.ObjectId()

    // Actual test begins.
    expect(productResolver(null, arg)).rejects.toThrow(ValidationError)

    // CleanUp.
    await Product.findByIdAndRemove(product._id)
  })
})
