/* eslint-env jest */

import { Types, ValidationError } from 'mongoose'

import Order from '../../database/models/order'
import User from '../../database/models/user'
import Product from '../../database/models/product'
import Address from '../../database/models/address'
import {
  orderResolver,
  ordersResolver,
} from '../../graphql/resolvers/queries/orderResolvers'
import { merge, pick, shuffleArray } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'
import { AuthorizationError, AuthenticationError } from '../../errors'
// import { compareAsc } from 'date-fns'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('orders resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
    phone: '657-588-9534',
    roles: ['admin'],
  }

  const dummyUnauthorisedUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
    phone: '857-857-6658',
  }

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

  const dummyAddress1 = {
    address1: '7745',
    address2: 'Harvey Village',
    landmark: 'Near Darian Common',
    city: 'Markston',
    state: 'North Carolina',
    zip: '10774',
    country: 'Japan',
  }

  const dummyAddress2 = {
    address1: '8578',
    address2: 'Brighton Street',
    landmark: 'Near Icie SuperMarket',
    city: 'Melbourne',
    state: 'Canneberra',
    zip: '85055',
    country: 'Australia',
  }

  const dummyAddress3 = {
    address1: '9663',
    address2: 'Lillington Village',
    landmark: 'Near Queen Mansion',
    city: 'Sai Mai',
    state: 'Bangkok',
    zip: '10220',
    country: 'Thailand',
  }

  const dummyOrder1 = {
    status: 'Processing',
    payment: {
      status: 'Processing',
      mode: 'Cash on Delivery',
      transactionID: Math.floor(Math.random() * 10000).toString(),
    },
    orderedAt: '2018-04-21T06:44:38.825Z',
  }

  const dummyOrder2 = {
    status: 'On its way',
    payment: {
      status: 'Unpaid',
      mode: 'Cash on Delivery',
      transactionID: Math.floor(Math.random() * 10000).toString(),
    },
    orderedAt: '2018-06-21T06:44:38.825Z',
  }
  // 2018-07-21T06:44:38.825Z
  const dummyOrder3 = {
    status: 'Dispatched',
    payment: {
      status: 'Paid',
      mode: 'E-wallet',
      transactionID: Math.floor(Math.random() * 10000).toString(),
    },
    orderedAt: '2018-07-14T06:44:38.825Z',
  }

  function compareValues(key, order = 'asc') {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

      let comparison = 0
      if (varA > varB) {
        comparison = 1
      } else if (varA < varB) {
        comparison = -1
      }
      return order === 'desc' ? comparison * -1 : comparison
    }
  }

  it('Should fetch all orders', async () => {
    expect.assertions(7)

    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])

    // Add the order to the database manually.
    const order1 = await merge(dummyOrder1, {
      products: orderProducts,
      shippingAddress: addresses[0]._id,
    })
    const order2 = await merge(dummyOrder2, {
      products: orderProducts,
      shippingAddress: addresses[1]._id,
    })
    const order3 = await merge(dummyOrder3, {
      products: orderProducts,
      shippingAddress: addresses[2]._id,
    })
    const orders = await Order.insertMany([order1, order2, order3])

    // Actual test begins.
    const fetchedOrderList = await ordersResolver(null, {}, { user })

    expect(fetchedOrderList.length).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('products')
    expect(fetchedOrderList[0].products.length).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('status')
    expect(fetchedOrderList[0].status).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('payment')
    expect(fetchedOrderList[0]).toHaveProperty('orderedAt')

    // Cleanup.
    const orderIDs = await orders.map(val => val._id)
    const productIDs = await products.map(val => val._id)
    const addressIDs = await addresses.map(val => val._id)
    await Order.deleteMany({
      _id: { $in: orderIDs },
    })
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should fetch orders sort by its date', async () => {
    expect.assertions(4)

    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])

    // Add the order to the database manually.
    const order1 = await merge(dummyOrder1, {
      products: orderProducts,
      shippingAddress: addresses[0]._id,
    })
    const order2 = await merge(dummyOrder2, {
      products: orderProducts,
      shippingAddress: addresses[1]._id,
    })
    const order3 = await merge(dummyOrder3, {
      products: orderProducts,
      shippingAddress: addresses[2]._id,
    })
    // Mock Sorting For Checking
    const orderList = [order1, order2, order3]
    orderList.sort(compareValues('orderedAt', 'asc'))

    const orders = await Order.insertMany([order1, order2, order3])

    // Actual test begins.
    const fetchedOrderList = await ordersResolver(
      null,
      { orderBy: { orderedAt: 'asc' } },
      { user }
    )
    console.log(fetchedOrderList)
    expect(fetchedOrderList.length).not.toBeNull()
    expect(fetchedOrderList[0].status).toBe(orderList[0].status)
    expect(fetchedOrderList[0].payment.status).toBe(orderList[0].payment.status)
    expect(fetchedOrderList[0].payment.mode).toBe(orderList[0].payment.mode)
    // Cleanup.
    const orderIDs = await orders.map(val => val._id)
    const productIDs = await products.map(val => val._id)
    const addressIDs = await addresses.map(val => val._id)
    await Order.deleteMany({
      _id: { $in: orderIDs },
    })
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should fetch orders filtered by its order date', async () => {
    expect.assertions(5)

    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])

    // Add the order to the database manually.
    const order1 = await merge(dummyOrder1, {
      products: orderProducts,
      shippingAddress: addresses[0]._id,
    })
    const order2 = await merge(dummyOrder2, {
      products: orderProducts,
      shippingAddress: addresses[1]._id,
    })
    const order3 = await merge(dummyOrder3, {
      products: orderProducts,
      shippingAddress: addresses[2]._id,
    })

    // Mocking filter function
    let orderList = [order1, order2, order3]
    orderList = orderList.filter(val => val.orderedAt === order2.orderedAt)

    const orders = await Order.insertMany([order1, order2, order3])
    const args = pick(orders[1], ['orderedAt'])

    // Actual test begins.
    const fetchedOrderList = await ordersResolver(
      null,
      { filters: args },
      { user }
    )

    expect(fetchedOrderList.length).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('_id')
    expect(fetchedOrderList[0]._id).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('orderedAt')
    expect(fetchedOrderList[0].orderedAt).not.toBeNull()

    // Cleanup.
    const orderIDs = await orders.map(val => val._id)
    const productIDs = await products.map(val => val._id)
    const addressIDs = await addresses.map(val => val._id)
    await Order.deleteMany({
      _id: { $in: orderIDs },
    })
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should fetch orders filtered by its order at and sorted by order date', async () => {
    expect.assertions(8)

    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])

    // Add the order to the database manually.
    const order1 = await merge(dummyOrder1, {
      products: orderProducts,
      shippingAddress: addresses[0]._id,
    })
    const order2 = await merge(dummyOrder2, {
      products: orderProducts,
      shippingAddress: addresses[1]._id,
    })
    const order3 = await merge(dummyOrder3, {
      products: orderProducts,
      shippingAddress: addresses[2]._id,
    })

    // Mocking filter function
    let orderList = [order1, order2, order3]
    orderList = orderList.filter(val => val.orderedAt === order2.orderedAt)
    orderList.sort(compareValues('orderedAt', 'asc'))

    const orders = await Order.insertMany([order1, order2, order3])
    const args = pick(orders[1], ['orderedAt'])

    // Actual test begins.
    const fetchedOrderList = await ordersResolver(
      null,
      {
        orderBy: { orderedAt: 'asc' },
        filters: args,
      },
      { user }
    )

    expect(fetchedOrderList.length).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('_id')
    expect(fetchedOrderList[0]._id).not.toBeNull()
    expect(fetchedOrderList[0]).toHaveProperty('orderedAt')
    expect(fetchedOrderList[0].orderedAt).not.toBeNull()
    expect(fetchedOrderList[0].status).toBe(orderList[0].status)
    expect(fetchedOrderList[0].payment.status).toBe(orderList[0].payment.status)
    expect(fetchedOrderList[0].payment.mode).toBe(orderList[0].payment.mode)

    // Cleanup.
    const orderIDs = await orders.map(val => val._id)
    const productIDs = await products.map(val => val._id)
    const addressIDs = await addresses.map(val => val._id)
    await Order.deleteMany({
      _id: { $in: orderIDs },
    })
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch orders if the user is not authorised', async () => {
    expect.assertions(1)

    // Setup.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUnauthorisedUser)
    // Get address for the order to be delivered to.
    const addresses = await Address.create(dummyAddress1)

    // Add the order to the database manually.
    const order = merge(dummyOrder1, {
      products: orderProducts,
      shippingAddress: addresses._id,
    })
    const order1 = await Order.create(order)

    // Actual test begins.
    expect(ordersResolver(null, {}, { user })).rejects.toThrow(
      new AuthorizationError()
    )

    // Cleanup.
    await Order.findByIdAndRemove(order1._id)
    await Address.findByIdAndRemove(addresses._id)
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch orders if there is no user', async () => {
    expect.assertions(1)

    // Setup.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const addresses = await Address.create(dummyAddress1)

    // Add the order to the database manually.
    const order = merge(dummyOrder1, {
      products: orderProducts,
      shippingAddress: addresses._id,
    })
    const order1 = await Order.create(order)

    // Actual test begins.
    expect(ordersResolver(null, {}, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await Order.findByIdAndRemove(order1._id)
    await Address.findByIdAndRemove(addresses._id)
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await User.findByIdAndRemove(user._id)
  })
})

describe('order resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
    phone: '657-588-9534',
    roles: ['admin'],
  }

  const dummyUnauthorisedUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
    phone: '857-857-6658',
  }

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
      status: 'Processing',
      mode: 'Cash on Delivery',
      transactionID: Math.floor(Math.random() * 10000).toString(),
    },
    orderedAt: Date.now(),
  }

  it('Should fetch an order on its id', async () => {
    expect.assertions(20)

    // Setup.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)

    // Add the order to the database manually.
    const order = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order1 = await Order.create(order)
    const args = { id: order1._id }

    // Actual test begins.
    const fetchedOrder = await orderResolver(null, args, { user })

    expect(fetchedOrder).toHaveProperty('_id')
    expect(fetchedOrder._id).toEqual(order1._id)
    expect(fetchedOrder).toHaveProperty('products')
    expect(fetchedOrder.products.product).toEqual(order1.products.product)
    expect(fetchedOrder.products.size).toEqual(order1.products.size)
    expect(fetchedOrder.products.tax).toEqual(order1.products.tax)
    expect(fetchedOrder.products.actualPrice).toEqual(
      order1.products.actualPrice
    )
    expect(fetchedOrder.products.discount).toEqual(order1.products.discount)
    expect(fetchedOrder.products.discountedPrice).toEqual(
      order1.products.discountedPrice
    )
    expect(fetchedOrder.products.quantity).toEqual(order1.products.quantity)
    expect(fetchedOrder).toHaveProperty('payment')
    expect(fetchedOrder.payment.status).toBe(order1.payment.status)
    expect(fetchedOrder.payment.mode).toBe(order1.payment.mode)
    expect(fetchedOrder.payment.transactionID).toEqual(
      order1.payment.transactionID
    )
    expect(fetchedOrder).toHaveProperty('status')
    expect(fetchedOrder.status).toBe(order1.status)
    expect(fetchedOrder).toHaveProperty('shippingAddress')
    expect(fetchedOrder.shippingAddress).toEqual(order1.shippingAddress)
    expect(fetchedOrder).toHaveProperty('orderedAt')
    expect(fetchedOrder.orderedAt).toEqual(order1.orderedAt)

    // Cleanup.
    await Order.findByIdAndRemove(order1._id)
    await Address.findByIdAndRemove(address._id)
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch orders if the user is not authorised', async () => {
    expect.assertions(1)

    // Setup.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUnauthorisedUser)
    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)

    // Add the order to the database manually.
    const order = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order1 = await Order.create(order)
    const args = { id: order1._id }

    // Actual test begins.
    expect(ordersResolver(null, args, { user })).rejects.toThrow(
      new AuthorizationError()
    )

    // Cleanup.
    await Order.findByIdAndRemove(order1._id)
    await Address.findByIdAndRemove(address._id)
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch orders if there is no user', async () => {
    expect.assertions(1)

    // Setup.
    const products = await Product.insertMany([
      dummyProduct1,
      dummyProduct2,
      dummyProduct3,
    ])
    const shuffledProducts = await shuffleArray(products).slice(0, 2)
    const orderProducts = await shuffledProducts.map(product => {
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
    const user = await User.create(dummyUser)
    // Get address for the order to be delivered to.
    const address = await Address.create(dummyAddress)

    // Add the order to the database manually.
    const order = merge(dummyOrder, {
      products: orderProducts,
      shippingAddress: address._id,
    })
    const order1 = await Order.create(order)
    const args = { id: order1._id }

    // Actual test begins.
    expect(ordersResolver(null, args, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await Order.findByIdAndRemove(order1._id)
    await Address.findByIdAndRemove(address._id)
    const productIDs = await products.map(val => val._id)
    await Product.deleteMany({
      _id: { $in: productIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch any order if the order is not present', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser)
    const args = new Types.ObjectId()

    // Actual test begins.
    expect(orderResolver(null, args, { user })).rejects.toThrow(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })
})
