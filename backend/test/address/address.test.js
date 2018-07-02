/* eslint-env jest */

import { ValidationError } from 'mongoose'

import User from '../../database/models/user'
import { addAddressResolver } from '../../graphql/resolvers/addressResolvers'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('addAddress resolver', () => {
  const user = {
    _id: '5b38fc019a3cb32bfc9d456c',
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
