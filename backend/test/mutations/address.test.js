/* eslint-env jest */

import { ValidationError, Types } from 'mongoose'

import Address from '../../database/models/address'
import Order from '../../database/models/order'
import User from '../../database/models/user'
import {
  addAddressResolver,
  removeAddressResolver,
  updateAddressResolver,
} from '../../graphql/resolvers/mutations/addressResolvers'
import { merge } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addAddress resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
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

  it(`Should add an address to user's list of addresses`, async () => {
    expect.assertions(2)
    const savedUser = await User.findById(user._id)
    const address = await addAddressResolver(null, dummyAddress, {
      user: savedUser,
    })
    expect(address).toHaveProperty('_id')
    expect(address).toMatchObject(dummyAddress)
  })

  it('Should not add an address when there is no user', async () => {
    expect.assertions(1)
    await expect(addAddressResolver(null, dummyAddress, {})).rejects.toThrow(
      'Must be logged in'
    )
  })

  it('Should not add address when fields are missing', async () => {
    expect.assertions(1)
    // Missing `address` field.
    const invalidAddress = {
      address2: 'Apt. 860',
      landmark: 'Near Ullrich Park',
      city: 'West Mariela',
      state: 'Arizona',
      zip: '11224',
      country: 'Czech Republic',
    }

    const savedUser = await User.findById(user._id)
    await expect(
      addAddressResolver(null, invalidAddress, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it('Should not add address when fields do not validate', async () => {
    expect.assertions(1)
    // Invalid zip code.
    const invalidAddress = {
      address1: 'Apt. 272',
      address2: 'Kuhlman Drives',
      landmark: 'Near Dickinson Cliff',
      city: 'West Opheliafort',
      state: 'Maine',
      zip: 'some random gibberish',
      country: 'Jersey',
    }

    const savedUser = await User.findById(user._id)
    await expect(
      addAddressResolver(null, invalidAddress, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })

  it('Should not add an address when 5 addresses already exist for a particular user', async () => {
    expect.assertions(9)
    const savedUser = await User.findById(user._id)

    // A test above has already added an address.
    for (let i = 0; i < 4; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const address = await addAddressResolver(null, dummyAddress, {
        user: savedUser,
      })
      expect(address).toHaveProperty('_id')
      expect(address).toMatchObject(dummyAddress)
    }

    await expect(
      addAddressResolver(null, dummyAddress, { user: savedUser })
    ).rejects.toThrowError(ValidationError)
  })
})

describe('updateAddress resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
  }

  const updatePayload = {
    address1: 'Apt. 684',
    address2: 'Sterling Ridge',
    landmark: 'Near Waters Ways',
    city: 'Taniaburgh',
    state: 'Maine',
    zip: '00239',
    country: 'Indonesia',
  }

  const dummyOrder = {
    products: [
      {
        product: new Types.ObjectId(),
        quantity: 1,
        actualPrice: 573.76,
        tax: 10,
        discount: 10,
        size: 'S',
      },
    ],
    status: 'Processing',
    payment: {
      status: 'Paid',
      mode: 'E-wallet',
      transactionID: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    orderedAt: Date.now(),
  }

  it(`Should update an address from user's list of addresses`, async () => {
    expect.assertions(2)
    const savedUser = await User.findById(user._id).populate('address')
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)

    const updatedAddress = await updateAddressResolver(
      null,
      merge(updatePayload, { id: savedUser.address[addressIndex]._id }),
      {
        user: savedUser,
      }
    )

    expect(updatedAddress).toHaveProperty('_id')
    expect(updatedAddress).toMatchObject(updatePayload)
  })

  it('Should not update an address when there is no user', async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, { id: savedUser.address[addressIndex]._id }),
        {}
      )
    ).rejects.toThrow('Must be logged in')
  })

  it(`Should not update an address when the address is not in user's list of addresses`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, { id: new Types.ObjectId() }),
        { user: savedUser }
      )
    ).rejects.toThrow('Unauthorized to update this address')
  })

  it('Should not update an address when a field is invalid', async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, {
          id: savedUser.address[addressIndex]._id,
          zip: 'some random gibberish',
        }),
        { user: savedUser }
      )
    ).rejects.toThrowError(ValidationError)
  })

  it('Should create a new address when an order by the user contains this address', async () => {
    expect.assertions(3)
    const savedUser = await User.findById(user._id).populate('address')
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)
    const order = await new Order(
      merge(dummyOrder, {
        shippingAddress: savedUser.address[addressIndex]._id,
      })
    ).save()
    savedUser.order.push(order._id)
    const updatedUser = await savedUser.save()

    const updatedAddress = await updateAddressResolver(
      null,
      merge(updatePayload, { id: savedUser.address[addressIndex]._id }),
      { user: updatedUser }
    )

    expect(updatedAddress).toHaveProperty('_id')
    expect(updatedAddress._id).not.toEqual(savedUser.address[addressIndex]._id)

    const recentlyUpdatedUser = await User.findById(user._id)
    expect(recentlyUpdatedUser.address).not.toContain(
      savedUser.address[addressIndex]._id
    )

    // Cleanup.
    await Address.findByIdAndRemove(order.shippingAddress)
    await Order.findByIdAndRemove(order._id)
    const updatedOrders = recentlyUpdatedUser.order.filter(
      currentOrder => currentOrder.toString() !== order._id.toString()
    )
    await User.findByIdAndUpdate(recentlyUpdatedUser._id, {
      order: updatedOrders,
    })
  })
})

describe('removeAddress resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
  }

  const dummyOrder = {
    products: [
      {
        product: new Types.ObjectId(),
        quantity: 1,
        actualPrice: 573.76,
        tax: 10,
        discount: 10,
        size: 'S',
      },
    ],
    status: 'Processing',
    payment: {
      status: 'Paid',
      mode: 'E-wallet',
      transactionID: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    orderedAt: Date.now(),
  }

  it(`Should delete an address from user's list of addresses`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id).populate('address')
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)
    const updatedAddresses = await removeAddressResolver(
      null,
      { id: savedUser.address[addressIndex]._id },
      { user: savedUser }
    )

    expect(updatedAddresses).not.toContain(savedUser.address[addressIndex])
  })

  it('Should not delete an address when there is no user', async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)
    await expect(
      removeAddressResolver(
        null,
        { id: savedUser.address[addressIndex]._id },
        {}
      )
    ).rejects.toThrow('Must be logged in')
  })

  it(`Should not delete an address when the address is not in user's list of addresses`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    await expect(
      removeAddressResolver(
        null,
        { id: new Types.ObjectId() },
        { user: savedUser }
      )
    ).rejects.toThrow('Unauthorized to delete this address')
  })

  it(`Should delete an address only from user's list of addresses when an order by the user contains this address`, async () => {
    expect.assertions(3)
    // Initial setup.
    const savedUser = await User.findById(user._id).populate('address')
    const addressIndex = Math.floor(Math.random() * savedUser.address.length)
    const order = await new Order(
      merge(dummyOrder, {
        shippingAddress: savedUser.address[addressIndex]._id,
      })
    ).save()
    savedUser.order.push(order._id)
    const updatedUser = await savedUser.save()

    // Remove the address.
    const updatedAddresses = await removeAddressResolver(
      null,
      { id: updatedUser.address[addressIndex]._id },
      { user: updatedUser }
    )

    const address = await Address.findById(savedUser.address[addressIndex]._id)

    expect(updatedAddresses).not.toContain(savedUser.address[addressIndex])
    expect(address).toHaveProperty('_id')
    expect(address._id).toEqual(savedUser.address[addressIndex]._id)

    // Cleanup.
    await Address.findByIdAndRemove(order.shippingAddress)
    await Order.findByIdAndRemove(order._id)
    const updatedOrders = updatedUser.order.filter(
      currentOrder => currentOrder.toString() !== order._id.toString()
    )
    await User.findByIdAndUpdate(updatedUser._id, { order: updatedOrders })
  })

  it(`Should remove all addresses from the user's list of addresses`, async () => {
    expect.assertions(3)
    // At this point, only user's list of addresses should have three addresses.
    const savedUser = await User.findById(user._id).populate('address')

    for (let i = 0; i < savedUser.address.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const updatedAddresses = await removeAddressResolver(
        null,
        { id: savedUser.address[i]._id },
        { user: savedUser }
      )
      expect(updatedAddresses).not.toContain(savedUser.address[i])
    }
  })
})
