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
import {
  AuthenticationError,
  AddressUnassociatedError,
  AuthorizationError,
} from '../../errors'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addAddress resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
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
    expect.assertions(5)
    // Setup.
    const user = await User.create(dummyUser)

    // Actual test begins.
    const address = await addAddressResolver(null, dummyAddress, { user })
    expect(address).toHaveProperty('_id')
    expect(address).toMatchObject(dummyAddress)

    const updatedUser = await User.findById(user._id)
    expect(updatedUser).toHaveProperty('address')
    expect(updatedUser.address).toHaveLength(1)
    expect(updatedUser.address).toContainEqual(address._id)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not add an address when there is no user', async () => {
    expect.assertions(1)
    await expect(addAddressResolver(null, dummyAddress, {})).rejects.toThrow(
      new AuthenticationError()
    )
  })

  it('Should not add an address when the user is not authorized to add an address', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))

    // Actual test begins.
    await expect(
      addAddressResolver(null, dummyAddress, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not add address when fields are missing', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)

    // Missing `address` field.
    const invalidAddress = {
      address2: 'Apt. 860',
      landmark: 'Near Ullrich Park',
      city: 'West Mariela',
      state: 'Arizona',
      zip: '11224',
      country: 'Czech Republic',
    }

    // Actual test begins.
    await expect(
      addAddressResolver(null, invalidAddress, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not add address when fields do not validate', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)

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

    // Actual test begins.
    const savedUser = await User.findById(user._id)
    await expect(
      addAddressResolver(null, invalidAddress, { user: savedUser })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not add an address when 5 addresses already exist for a particular user', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)
    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await addAddressResolver(null, dummyAddress, { user })
    }
    const updatedUser = await User.findById(user._id)

    // Actual test begins.
    await expect(
      addAddressResolver(null, dummyAddress, { user: updatedUser })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await Address.deleteMany({ _id: { $in: updatedUser.address } })
    await User.findByIdAndRemove(user._id)
  })
})

describe('updateAddress resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
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
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(merge(dummyUser, { address: [address._id] }))
    const addressIndex = Math.floor(Math.random() * user.address.length)

    // Actual test begins.
    const updatedAddress = await updateAddressResolver(
      null,
      merge(updatePayload, { id: user.address[addressIndex] }),
      { user }
    )

    expect(updatedAddress).toHaveProperty('_id')
    expect(updatedAddress).toMatchObject(updatePayload)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update an address when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(merge(dummyUser, { address: [address._id] }))
    const addressIndex = Math.floor(Math.random() * user.address.length)

    // Actual test begins.
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, { id: user.address[addressIndex] }),
        {}
      )
    ).rejects.toThrow(new AuthenticationError())

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update an address when the user is not authorized to update an address', async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(
      merge(dummyUser, { roles: ['admin'], address: [address._id] })
    )
    const addressIndex = Math.floor(Math.random() * user.address.length)

    // Actual test begins.
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, { id: user.address[addressIndex] }),
        { user }
      )
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not update an address when the address is not in user's list of addresses`, async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(merge(dummyUser, { address: [address._id] }))

    // Actual test begins.
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, { id: new Types.ObjectId() }),
        { user }
      )
    ).rejects.toThrow(new AddressUnassociatedError())

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update an address when a field is invalid', async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(merge(dummyUser, { address: [address._id] }))
    const addressIndex = Math.floor(Math.random() * user.address.length)

    // Actual test begins.
    await expect(
      updateAddressResolver(
        null,
        merge(updatePayload, {
          id: user.address[addressIndex],
          zip: 'some random gibberish',
        }),
        { user }
      )
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should create a new address when an order by the user contains this address', async () => {
    expect.assertions(4)
    // Setup.
    const address = await Address.create(dummyAddress)
    const order = await Order.create(
      merge(dummyOrder, {
        shippingAddress: address._id,
      })
    )
    const user = await User.create(
      merge(dummyUser, { address: [address._id], order: [order._id] })
    )
    const addressIndex = Math.floor(Math.random() * user.address.length)

    // Actual test begins.
    const updatedAddress = await updateAddressResolver(
      null,
      merge(updatePayload, { id: user.address[addressIndex] }),
      { user }
    )

    expect(updatedAddress).toHaveProperty('_id')
    expect(updatedAddress._id).not.toEqual(user.address[addressIndex])

    const recentlyUpdatedUser = await User.findById(user._id)
    expect(recentlyUpdatedUser.address).not.toContain(
      user.address[addressIndex]
    )
    expect(recentlyUpdatedUser.address).toContain(updatedAddress._id)

    // Cleanup.
    await Address.deleteMany({
      _id: { $in: [address._id, order.shippingAddress] },
    })
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndRemove(user._id)
  })
})

describe('removeAddress resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
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
    expect.assertions(2)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(merge(dummyUser, { address: [address._id] }))

    // Actual test begins.
    const updatedAddresses = await removeAddressResolver(
      null,
      { id: address._id },
      { user }
    )
    expect(updatedAddresses).not.toContain(address._id)
    const removedAddress = await Address.findById(address._id)
    expect(removedAddress).toBeNull()

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not delete an address when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(merge(dummyUser, { address: [address._id] }))

    // Actual test begins.
    await expect(
      removeAddressResolver(null, { id: address._id }, {})
    ).rejects.toThrow(new AuthenticationError())

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it('Should not delete an address when the user is not authorized to delete an address', async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(
      merge(dummyUser, { address: [address._id], roles: ['admin'] })
    )

    // Actual test begins.
    await expect(
      removeAddressResolver(null, { id: address._id }, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should not delete an address when the address is not in user's list of addresses`, async () => {
    expect.assertions(1)
    // Setup.
    const address = await Address.create(dummyAddress)
    const user = await User.create(dummyUser)

    // Actual test begins.
    await expect(
      removeAddressResolver(null, { id: address._id }, { user })
    ).rejects.toThrow(new AddressUnassociatedError())

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await User.findByIdAndRemove(user._id)
  })

  it(`Should delete an address only from user's list of addresses when an order by the user contains this address`, async () => {
    expect.assertions(3)
    // Initial setup.
    const address = await Address.create(dummyAddress)
    const order = await Order.create(
      merge(dummyOrder, {
        shippingAddress: address._id,
      })
    )
    const user = await User.create(
      merge(dummyUser, { address: [address._id], order: [order._id] })
    )

    // Actual test begins.
    const updatedAddresses = await removeAddressResolver(
      null,
      { id: address._id },
      { user }
    )

    expect(updatedAddresses).not.toContain(address._id)
    const unremovedAddress = await Address.findById(address._id)
    expect(unremovedAddress).not.toBeNull()
    expect(unremovedAddress).toMatchObject(dummyAddress)

    // Cleanup.
    await Address.findByIdAndRemove(address._id)
    await Order.findByIdAndRemove(order._id)
    await User.findByIdAndRemove(user._id)
  })
})
