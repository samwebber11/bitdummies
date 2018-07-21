/* eslint-env jest */

import { Types, ValidationError } from 'mongoose'

import Address from '../../database/models/address'
import User from '../../database/models/user'
import { AuthenticationError, AuthorizationError } from '../../errors'
import {
  addressesResolver,
  addressResolver,
} from '../../graphql/resolvers/queries/addressResolvers'
import { address } from '../../graphql/queries/addressQueries'

import { pick } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addresses resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
    roles: ['admin'],
  }

  const dummyUnauthorizedUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
    phone: '857-857-6658',
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

  // Dynamic Sorting Function.
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

  it('Should fetch a list of all addresses', async () => {
    expect.assertions(7)

    // Setup.
    const addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])

    // Actual Test begins.
    const fetchedAddressList = await addressesResolver(null, {}, { user })

    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0]).toHaveProperty('address1')
    expect(fetchedAddressList[0]).toHaveProperty('address2')
    expect(fetchedAddressList[0]).toHaveProperty('landmark')
    expect(fetchedAddressList[0]).toHaveProperty('city')
    expect(fetchedAddressList[0]).toHaveProperty('zip')
    expect(fetchedAddressList[0]).toHaveProperty('country')

    // CleanUp.
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({ _id: { $in: addressIDs } })
    await User.findByIdAndRemove(user._id)
  })

  it('Should fetch addresses in order by country', async () => {
    expect.assertions(3)

    // Setup.
    const addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    addressList.sort(compareValues('country', 'asc'))

    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    const fetchedAddressList = await addressesResolver(
      null,
      { orderBy: { country: 'asc' } },
      { user }
    )

    expect(fetchedAddressList[0]).toHaveProperty('country')
    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0].country).toBe(addressList[0].country)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should fetch address filtered by its city', async () => {
    expect.assertions(3)

    // Setup.
    let addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    addressList = addressList.filter(val => val.city === 'Markston')
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    const arg = pick(addresses[0], ['city'])

    // Actual test begins.
    const fetchedAddressList = await addressesResolver(
      null,
      { filters: arg },
      { user }
    )
    expect(fetchedAddressList[0]).toHaveProperty('city')
    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0].city).toBe(addressList[0].city)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should fetch address filtered by its zip', async () => {
    expect.assertions(3)

    // Setup.
    let addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    addressList = addressList.filter(val => val.zip === '85055')
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    const arg = pick(addresses[1], ['zip'])

    // Actual test begins.
    const fetchedAddressList = await addressesResolver(
      null,
      { filters: arg },
      { user }
    )
    expect(fetchedAddressList[0]).toHaveProperty('zip')
    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0].zip).toBe(addressList[0].zip)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should fetch address filtered by its country', async () => {
    expect.assertions(3)

    // Setup.
    let addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    addressList = addressList.filter(val => val.country === 'Thailand')
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    const arg = pick(addresses[2], ['country'])

    // Actual test begins.
    const fetchedAddressList = await addressesResolver(
      null,
      { filters: arg },
      { user }
    )

    expect(fetchedAddressList[0]).toHaveProperty('country')
    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0].country).toBe(addressList[0].country)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should fetch address filtered by its state', async () => {
    expect.assertions(3)

    // Setup.
    let addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    addressList = addressList.filter(val => val.state === 'Bangkok')
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    const arg = pick(addresses[2], ['state'])

    // Actual test begins.
    const fetchedAddressList = await addressesResolver(
      null,
      { filters: arg },
      { user }
    )
    expect(fetchedAddressList[0]).toHaveProperty('state')
    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0].state).toBe(addressList[0].state)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should not fetch address if the user is not authorized', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUnauthorizedUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    // Actual test begins.
    await expect(addressesResolver(null, {}, { user })).rejects.toThrow(
      new AuthorizationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should not fetch address if there is no user', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])

    // Actual test begins.
    await expect(addressesResolver(null, {}, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })

  it('Should fetch address order by its country and filter by city', async () => {
    expect.assertions(5)

    // Setup.
    let addressList = [dummyAddress1, dummyAddress2, dummyAddress3]
    addressList = addressList.filter(val => val.city === 'Melbourne')
    addressList.sort(compareValues('country', 'asc'))
    const user = await User.create(dummyUser)
    const addresses = await Address.insertMany([
      dummyAddress1,
      dummyAddress2,
      dummyAddress3,
    ])
    const arg = pick(addresses[1], ['city'])

    // Actual test begins.
    const fetchedAddressList = await addressesResolver(
      null,
      {
        orderBy: { country: 'asc' },
        filters: arg,
      },
      { user }
    )
    expect(fetchedAddressList[0]).toHaveProperty('country')
    expect(fetchedAddressList[0]).toHaveProperty('city')
    expect(fetchedAddressList.length).toBeGreaterThanOrEqual(addressList.length)
    expect(fetchedAddressList[0].country).toBe(addressList[0].country)
    expect(fetchedAddressList[0].city).toBe(addressList[0].city)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    const addressIDs = await addresses.map(val => val._id)
    await Address.deleteMany({
      _id: { $in: addressIDs },
    })
  })
})

describe('address resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
    phone: '657-588-9534',
    roles: ['admin'],
  }

  const dummyaddressPayload = {
    address1: '7745',
    address2: 'Harvey Village',
    landmark: 'Near Darian Common',
    city: 'Markston',
    state: 'North Carolina',
    zip: '10774',
    country: 'Japan',
  }
  const dummyUnauthorizedUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
    phone: '857-857-6658',
  }

  it(`Should fetch an address by id`, async () => {
    expect.assertions(16)

    // Setup.
    const user = await User.create(dummyUser)
    const addressPayload = await Address.create(dummyaddressPayload)
    const args = { id: addressPayload._id }

    // Actual test begins.
    const fetchedAddress = await addressResolver(null, args, {
      user,
    })

    expect(fetchedAddress).toHaveProperty('_id')
    expect(fetchedAddress._id).toEqual(addressPayload._id)
    expect(fetchedAddress).toHaveProperty('address1')
    expect(fetchedAddress.address1).toBe(addressPayload.address1)
    expect(fetchedAddress).toHaveProperty('address2')
    expect(fetchedAddress.address2).toBe(addressPayload.address2)
    expect(fetchedAddress).toHaveProperty('city')
    expect(fetchedAddress.city).toBe(addressPayload.city)
    expect(fetchedAddress).toHaveProperty('country')
    expect(fetchedAddress.country).toBe(addressPayload.country)
    expect(fetchedAddress).toHaveProperty('landmark')
    expect(fetchedAddress.landmark).toBe(addressPayload.landmark)
    expect(fetchedAddress).toHaveProperty('zip')
    expect(fetchedAddress.zip).toBe(addressPayload.zip)
    expect(fetchedAddress).toHaveProperty('state')
    expect(fetchedAddress.state).toBe(addressPayload.state)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    await Address.findByIdAndRemove(addressPayload._id)
  })

  it('Should not fetch an address if the user is not authorized', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUnauthorizedUser)
    const addressPayload = await Address.create(dummyaddressPayload)
    const args = { id: addressPayload._id }

    // Actual test begins.
    await expect(addressResolver(null, args, { user })).rejects.toThrow(
      new AuthorizationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    await Address.findByIdAndRemove(addressPayload._id)
  })

  it('Should not fetch an address if there is no address', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser)
    const arg = new Types.ObjectId()

    // Actual test begins

    await expect(addressResolver(null, arg, { user })).rejects.toThrow(
      ValidationError
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch an address if there is no user', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser)
    const addressPayload = await Address.create(dummyaddressPayload)
    const args = { id: addressPayload._id }

    // Actual test begins.
    expect(addressResolver(null, args, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
    await Address.findByIdAndRemove(address._id)
  })
})
