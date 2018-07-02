/* eslint-env jest */

import User from '../../database/models/user'
import { connectMongoose, disconnectMongoose } from '../helper'
import { addProductResolver } from '../../graphql/resolvers/productResolvers'

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
    const savedUser = User.findById(user._id)
    const product = await addProductResolver(null, dummyProduct, {
      user: savedUser,
    })
    expect(product).toHaveProperty('_id')
    // Hack so as to do a deep comparison of the two objects.
    expect(JSON.parse(JSON.stringify(product))).toMatchObject(dummyProduct)
  })
})
