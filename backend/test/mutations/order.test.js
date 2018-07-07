/* eslint-env jest */

import { Types, ValidationError } from 'mongoose'

import Address from '../../database/models/address'
import Order from '../../database/models/order'
import Product from '../../database/models/product'
import User from '../../database/models/user'
import {
  addOrderResolver,
  cancelOrderResolver,
  removeProductFromOrderResolver,
  changeOrderStatusResolver,
} from '../../graphql/resolvers/mutations/orderResolvers'
import { merge, shuffleArray } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'

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

  it('Should create an order', async () => {
    expect.assertions(25)

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
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    const order = await addOrderResolver(null, orderArgs, { user: savedUser })

    expect(order).toHaveProperty('_id')
    expect(order).toHaveProperty('products')
    expect(order.products).toHaveLength(2)

    // order.products.length will be 2
    for (let i = 0; i < 2; i += 1) {
      expect(order.products[i]).toHaveProperty('quantity')
      expect(order.products[i]).toHaveProperty('actualPrice')
      expect(order.products[i]).toHaveProperty('tax')
      expect(order.products[i]).toHaveProperty('discount')
      expect(order.products[i]).toHaveProperty('discountedPrice')
      expect(order.products[i]).toHaveProperty('size')
      expect(order.products[i]).toMatchObject(orderProducts[i])
    }

    expect(order).toHaveProperty('status')
    expect(order.status).toBe('Processing')
    expect(order).toHaveProperty('payment')
    expect(order.payment).toHaveProperty('status')
    expect(order.payment.status).toBe('Paid')
    expect(order).toHaveProperty('shippingAddress')
    expect(order.shippingAddress).toEqual(address._id)
    expect(order).toHaveProperty('orderedAt')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should add an order to user's list of orders`, async () => {
    expect.assertions(3)

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
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    const order = await addOrderResolver(null, orderArgs, { user: savedUser })

    expect(order).toHaveProperty('_id')

    const updatedUser = await User.findById(user._id, 'order')
    expect(updatedUser.order).not.toHaveLength(0)
    expect(updatedUser.order).toContain(order._id)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not add an order when there is no user', async () => {
    expect.assertions(1)
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
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    await expect(addOrderResolver(null, orderArgs, {})).rejects.toThrow(
      'Must be logged in'
    )

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, { $pull: { address: address._id } })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should not add an order when products aren't provided`, async () => {
    expect.assertions(1)
    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { shippingAddress: address._id }
    await expect(
      addOrderResolver(null, orderArgs, { user: savedUser })
    ).rejects.toThrow('Must have at least one product')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, { $pull: { address: address._id } })
  })

  it(`Should not add an order when 'products' field is an empty array`, async () => {
    expect.assertions(1)
    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: [], shippingAddress: address._id }
    await expect(
      addOrderResolver(null, orderArgs, { user: savedUser })
    ).rejects.toThrow('Must have at least one product')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, { $pull: { address: address._id } })
  })

  it(`Should not add an order when 'products' field is invalid`, async () => {
    expect.assertions(1)
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
        product: new Types.ObjectId(),
        size: label,
        quantity: quantityAvailable - 2,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    await expect(
      addOrderResolver(null, orderArgs, { user: savedUser })
    ).rejects.toThrow('Products not in database')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, { $pull: { address: address._id } })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not add an order when quantity of a product is more than available quantity', async () => {
    expect.assertions(1)
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
    orderProducts[0].quantity += 3 // 1 more than available quantity

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    await expect(
      addOrderResolver(null, orderArgs, { user: savedUser })
    ).rejects.toThrow('Quantity limit exceeded')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, { $pull: { address: address._id } })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should not add an order when 'address' field is invalid`, async () => {
    expect.assertions(1)
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
    const address = new Types.ObjectId()
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    await expect(
      addOrderResolver(null, orderArgs, { user: savedUser })
    ).rejects.toThrow('Invalid address')

    // Cleanup.
    await User.findByIdAndUpdate(user._id, { $pull: { address: address._id } })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should not add an order when address doesn't belong to the user`, async () => {
    expect.assertions(1)
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

    // Get address for the order to be delivered to but not added
    // to user's list of addresses.
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findById(user._id)

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    await expect(
      addOrderResolver(null, orderArgs, { user: savedUser })
    ).rejects.toThrow('Address is not associated with user')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should ignore the prices and discounts for the products provided to it and use the ones in the database`, async () => {
    expect.assertions(41)
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
        actualPrice: 0, // Vicious field.
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    const orderArgs = { products: orderProducts, shippingAddress: address._id }
    const order = await addOrderResolver(null, orderArgs, { user: savedUser })

    expect(order).toHaveProperty('_id')
    expect(order).toHaveProperty('products')
    expect(order.products).toHaveLength(2)

    // order.products.length will be 2
    for (let i = 0; i < 2; i += 1) {
      expect(order.products[i]).toHaveProperty('quantity')
      expect(order.products[i].quantity).toBe(orderProducts[i].quantity)

      expect(order.products[i]).toHaveProperty('actualPrice')
      const product = shuffledProducts.find(
        pro => pro._id === order.products[i].product
      )
      expect(order.products[i].actualPrice).toBe(product.actualPrice)

      expect(order.products[i]).toHaveProperty('tax')
      expect(order.products[i].tax).toBe(product.tax)
      expect(order.products[i]).toHaveProperty('discount')
      expect(order.products[i].discount).toBe(product.discount)
      expect(order.products[i]).toHaveProperty('discountedPrice')
      expect(order.products[i].discountedPrice).toBeCloseTo(
        parseFloat(product.discountedPrice)
      )

      expect(order.products[i]).toHaveProperty('size')
      expect(order.products[i].size).toBe(orderProducts[i].size)
      expect(order.products[i]).toHaveProperty('quantity')
      expect(order.products[i].quantity).toBe(orderProducts[i].quantity)
    }

    expect(order).toHaveProperty('status')
    expect(order.status).toBe('Processing')
    expect(order).toHaveProperty('payment')
    expect(order.payment).toHaveProperty('status')
    expect(order.payment.status).toBe('Paid')
    expect(order).toHaveProperty('shippingAddress')
    expect(order.shippingAddress).toEqual(address._id)
    expect(order).toHaveProperty('orderedAt')

    const updatedUser = await User.findById(user._id, 'order')
    expect(updatedUser.order).not.toHaveLength(0)
    expect(updatedUser.order).toContain(order._id)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })
})

describe('cancelOrder resolver', () => {
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

  const dummyOrder = {
    status: 'Processing',
    payment: {
      status: 'Paid',
      mode: 'E-wallet',
      transactionID: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    orderedAt: Date.now(),
  }

  it('Should cancel an order', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const cancelledOrder = await cancelOrderResolver(
      null,
      { id: order._id },
      { user: savedUser }
    )

    expect(JSON.parse(JSON.stringify(cancelledOrder))).toMatchObject(
      JSON.parse(JSON.stringify(order))
    )

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should remove the order from user's list of orders`, async () => {
    expect.assertions(2)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    await cancelOrderResolver(null, { id: order._id }, { user: savedUser })

    const updatedUser = await User.findById(user._id, 'order')
    expect(updatedUser.order.length).not.toBe(savedUser.order.length)
    expect(updatedUser.order).not.toContain(order._id)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not remove an order when there is no user', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    await expect(
      cancelOrderResolver(null, { id: order._id }, {})
    ).rejects.toThrow('Must be logged in')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not remove an order when order ID is invalid', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    await expect(
      cancelOrderResolver(
        null,
        { id: new Types.ObjectId() },
        { user: savedUser }
      )
    ).rejects.toThrow('Invalid order')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should not remove an order when its status is not 'Processing'`, async () => {
    expect.assertions(3)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the orders to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order1Args = merge(orderArgs, { status: 'Dispatched' })
    const order2Args = merge(orderArgs, { status: 'On its way' })
    const order3Args = merge(orderArgs, { status: 'Delivered' })

    const order1 = await Order.create(order1Args)
    const order2 = await Order.create(order2Args)
    const order3 = await Order.create(order3Args)

    const orderIDs = [order1._id, order2._id, order3._id]

    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: { $each: orderIDs } } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    await Promise.all(
      orderIDs.map(async orderID => {
        await expect(
          cancelOrderResolver(null, { id: orderID }, { user: savedUser })
        ).rejects.toThrow('Order cannot be cancelled now')
      })
    )

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: { $in: orderIDs } },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
    await Order.deleteMany({ _id: { $in: orderIDs } })
  })

  it(`Should not remove an order when the order doesn't belong to the user`, async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually but do not save the
    // order ID to the user's list of orders.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findById(user._id)

    // Actual test begins.
    await expect(
      cancelOrderResolver(null, { id: order._id }, { user: savedUser })
    ).rejects.toThrow('Order does not belong to the current user')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })
})

describe('removeProductFromOrder resolver', () => {
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

  const dummyOrder = {
    status: 'Processing',
    payment: {
      status: 'Paid',
      mode: 'E-wallet',
      transactionID: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    orderedAt: Date.now(),
  }

  it('Should remove product from the order', async () => {
    expect.assertions(4)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    const productToBeRemoved = shuffleArray(orderProducts)[0]
    const args = { id: order._id, product: productToBeRemoved.product }
    const updatedOrder = await removeProductFromOrderResolver(null, args, {
      user: savedUser,
    })

    expect(updatedOrder).toHaveProperty('_id')
    expect(updatedOrder).toHaveProperty('products')
    expect(updatedOrder.products).toHaveLength(order.products.length - 1)
    const orderProductIDs = updatedOrder.products.map(
      product => product.product
    )
    expect(orderProductIDs).not.toContain(productToBeRemoved.product)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not alter any other field', async () => {
    expect.assertions(15)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    const productToBeRemoved = shuffleArray(orderProducts)[0]
    const args = { id: order._id, product: productToBeRemoved.product }
    const updatedOrder = await removeProductFromOrderResolver(null, args, {
      user: savedUser,
    })

    expect(updatedOrder).toHaveProperty('_id')
    expect(updatedOrder._id).toEqual(order._id)
    expect(updatedOrder).toHaveProperty('status')
    expect(updatedOrder.status).toBe(order.status)
    expect(updatedOrder).toHaveProperty('payment')
    expect(updatedOrder.payment).toHaveProperty('status')
    expect(updatedOrder.payment.status).toBe(order.payment.status)
    expect(updatedOrder.payment).toHaveProperty('mode')
    expect(updatedOrder.payment.mode).toBe(order.payment.mode)
    expect(updatedOrder.payment).toHaveProperty('transactionID')
    expect(updatedOrder.payment.transactionID).toEqual(
      order.payment.transactionID
    )
    expect(updatedOrder).toHaveProperty('shippingAddress')
    expect(updatedOrder.shippingAddress).toEqual(order.shippingAddress)
    expect(updatedOrder).toHaveProperty('orderedAt')
    expect(updatedOrder.orderedAt).toEqual(order.orderedAt)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not remove a product from an order when there is no user', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const productToBeRemoved = shuffleArray(orderProducts)[0]
    const args = { id: order._id, product: productToBeRemoved.product }
    await expect(
      removeProductFromOrderResolver(null, args, {})
    ).rejects.toThrow('Must be logged in')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not remove a product from an order when order ID is invalid', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const productToBeRemoved = shuffleArray(orderProducts)[0]
    const args = {
      id: new Types.ObjectId(),
      product: productToBeRemoved.product,
    }
    await expect(
      removeProductFromOrderResolver(null, args, { user: savedUser })
    ).rejects.toThrow('Invalid order')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it(`Should not remove a product from an order when its status is not 'Processing'`, async () => {
    expect.assertions(3)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })

    const order1Args = merge(orderArgs, { status: 'Dispatched' })
    const order2Args = merge(orderArgs, { status: 'On its way' })
    const order3Args = merge(orderArgs, { status: 'Delivered' })

    const order1 = await Order.create(order1Args)
    const order2 = await Order.create(order2Args)
    const order3 = await Order.create(order3Args)

    const orderIDs = [order1._id, order2._id, order3._id]

    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: { $each: orderIDs } } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const productToBeRemoved = shuffleArray(orderProducts)[0]
    await Promise.all(
      orderIDs.map(async orderID => {
        await expect(
          removeProductFromOrderResolver(
            null,
            { id: orderID, product: productToBeRemoved._id },
            { user: savedUser }
          )
        ).rejects.toThrow('Order items cannot be changed now')
      })
    )

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: { $in: orderIDs } },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
    await Order.deleteMany({ _id: { $in: orderIDs } })
  })

  it(`Should not remove a product from an order when the order doesn't belong to the user`, async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually but do not save the
    // order ID to the user's list of orders.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findById(user._id)

    const productToBeRemoved = shuffleArray(orderProducts)[0]
    const args = {
      id: order._id,
      product: productToBeRemoved.product,
    }
    await expect(
      removeProductFromOrderResolver(null, args, { user: savedUser })
    ).rejects.toThrow('Order does not belong to the current user')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not remove a product from an order when product ID is invalid', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const args = { id: order._id, product: new Types.ObjectId() }
    await expect(
      removeProductFromOrderResolver(null, args, { user: savedUser })
    ).rejects.toThrow('Invalid product')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not remove a product from an order when product ID is not contained in the order', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const unorderedProduct = await Product.create(dummyProduct1)
    const args = { id: order._id, product: unorderedProduct._id }
    await expect(
      removeProductFromOrderResolver(null, args, { user: savedUser })
    ).rejects.toThrow('Product not found in order')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
    await Product.findByIdAndRemove(unorderedProduct._id)
  })
})

describe('changeOrderStatus resolver', () => {
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

  const dummyOrder = {
    status: 'Processing',
    payment: {
      status: 'Paid',
      mode: 'E-wallet',
      transactionID: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    orderedAt: Date.now(),
  }

  it('Should change the status of an order', async () => {
    expect.assertions(4)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const status = 'Dispatched'
    const args = { id: order._id, status }
    const updatedOrder = await changeOrderStatusResolver(null, args, {
      user: savedUser,
    })

    expect(updatedOrder).toHaveProperty('_id')
    expect(updatedOrder).toHaveProperty('status')
    expect(updatedOrder.status).not.toBe(order.status)
    expect(updatedOrder.status).toBe(status)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not alter any other field', async () => {
    expect.assertions(17)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const status = 'Delivered'
    const args = { id: order._id, status }
    const updatedOrder = await changeOrderStatusResolver(null, args, {
      user: savedUser,
    })

    expect(updatedOrder).toHaveProperty('_id')
    expect(updatedOrder._id).toEqual(order._id)
    expect(updatedOrder).toHaveProperty('products')
    expect(updatedOrder.products).toHaveLength(order.products.length)

    for (let i = 0; i < updatedOrder.products.length; i += 1) {
      expect(
        JSON.parse(JSON.stringify(updatedOrder.products[i]))
      ).toMatchObject(JSON.parse(JSON.stringify(order.products[i])))
    }

    expect(updatedOrder).toHaveProperty('payment')
    expect(updatedOrder.payment).toHaveProperty('status')
    expect(updatedOrder.payment.status).toBe(order.payment.status)
    expect(updatedOrder.payment).toHaveProperty('mode')
    expect(updatedOrder.payment.mode).toBe(order.payment.mode)
    expect(updatedOrder.payment).toHaveProperty('transactionID')
    expect(updatedOrder.payment.transactionID).toEqual(
      order.payment.transactionID
    )
    expect(updatedOrder).toHaveProperty('shippingAddress')
    expect(updatedOrder.shippingAddress).toEqual(order.shippingAddress)
    expect(updatedOrder).toHaveProperty('orderedAt')
    expect(updatedOrder.orderedAt).toEqual(order.orderedAt)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not change the status of an order when there is no user', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins.
    const status = 'Delivered'
    const args = { id: order._id, status }
    await expect(changeOrderStatusResolver(null, args, {})).rejects.toThrow(
      'Unauthorized'
    )

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not change the status of an order when status is invalid', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins. No status provided.
    const args = { id: order._id }
    await expect(
      changeOrderStatusResolver(null, args, { user: savedUser })
    ).rejects.toThrow('Invalid status')

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not change the status of an order when status is not one of the defined values', async () => {
    expect.assertions(1)
    // Get products to be added to the order.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = shuffleArray(products).slice(0, 2)
    const orderProducts = shuffledProducts.map(product => {
      const { _id, size, actualPrice, tax, discount } = product
      const sizeIndex = Math.floor(Math.random() * size.length)
      const { label, quantityAvailable } = size[sizeIndex]
      return {
        product: _id,
        size: label,
        quantity: quantityAvailable - 2,
        actualPrice,
        tax,
        discount,
      }
    })

    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)
    await User.findByIdAndUpdate(
      user._id,
      { $push: { address: address._id } },
      { new: true, runValidators: true }
    )

    // Add the order to the database manually.
    const orderArgs = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order = await Order.create(orderArgs)
    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { order: order._id } },
      { new: true, runValidators: true }
    )

    // Actual test begins. No status provided.
    const status = 'Molestias veritatis quis laborum'
    const args = { id: order._id, status }
    await expect(
      changeOrderStatusResolver(null, args, { user: savedUser })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { address: address._id, order: order._id },
    })
    const productIDs = products.map(product => product._id)
    await Product.deleteMany({ _id: { $in: productIDs } })
  })

  it('Should not change the status of an order when order ID is invalid', async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const status = 'On its way'
    const args = { id: new Types.ObjectId(), status }
    await expect(
      changeOrderStatusResolver(null, args, { user: savedUser })
    ).toMatchObject({})
  })
})
