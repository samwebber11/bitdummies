/* eslint-env jest */

import Address from '../../database/models/address'
import Product from '../../database/models/product'
import User from '../../database/models/user'
import { addOrderResolver } from '../../graphql/resolvers/orderResolvers'
import { shuffleArray } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'
import Order from '../../database/models/order'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addOrder resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
  }

  const dummyProduct1 = {
    name: 'Handcrafted Plastic Computer',
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
    actualPrice: 984.99,
    imagePath: [
      'Optio labore laudantium et et a eaque sed',
      'Neque non ullam nam qui corrupti similique officia aut quis',
      'Et explicabo aut dicta',
    ],
  }

  const dummyProduct2 = {
    name: 'Unbranded Soft Hat',
    size: [
      {
        label: 'L',
        quantityAvailable: 10,
      },
      {
        label: 'XL',
        quantityAvailable: 15,
      },
    ],
    actualPrice: 702.99,
    imagePath: [
      'Aspernatur est similique blanditiis aut et sit',
      'Commodi quod officia recusandae',
      'Alias dolor consequatur ab rerum quia rerum inventore',
      'Adipisci iure veniam',
    ],
  }

  const dummyProduct3 = {
    name: 'Tasty Wooden Pizza',
    size: [
      {
        label: 'S',
        quantityAvailable: 10,
      },
      {
        label: 'L',
        quantityAvailable: 5,
      },
      {
        label: 'XL',
        quantityAvailable: 15,
      },
    ],
    actualPrice: 888.99,
    imagePath: [
      'Sunt quisquam in beatae',
      'Quia cumque odit ut voluptatem velit nulla',
      'Natus dicta minima explicabo earum optio reiciendis provident',
    ],
  }

  const dummyAddress = {
    address1: '7745',
    address2: 'Harvey Village',
    landmark: 'Near Darian Common',
    city: 'Markston',
    state: 'North Carolina',
    zip: '10774',
    country: 'Japan',
  }

  it(`Should add an order to user's list of orders`, async () => {
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const sizeIndex = Math.floor(Math.random() * product.size.length)
      const { label, quantityAvailable } = product.size[sizeIndex]
      return {
        product: product._id,
        size: label,
        quantity: quantityAvailable - 2,
      }
    })

    // Get address for the order to be delivered to.
    const address = await new Address(dummyAddress).save()
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { address: address._id },
      },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address }
    const order = await addOrderResolver(null, orderArgs, { user: savedUser })

    expect(order).toHaveProperty('_id')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    const updatedUser = await User.findById(user._id)
    const addressIndex = updatedUser.address.findIndex(
      userAddress => userAddress.toString() === address._id.toString()
    )
    updatedUser.address.splice(addressIndex, 1)
    const orderIndex = updatedUser.order.findIndex(
      userOrder => userOrder.toString() === order._id.toString()
    )
    updatedUser.order.splice(orderIndex, 1)
    await updatedUser.save()
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })
})
