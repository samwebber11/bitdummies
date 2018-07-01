/* eslint-env jest */

import User from '../../database/models/user'
import { addAddressResolver } from '../../graphql/resolvers/addressResolvers'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('Address test', () => {
  const user = new User({
    provider: {
      name: 'google',
      id: (Math.floor(Math.random * 1000000000) + 1).toString(),
    },
    email: 'dummymail@gmail.com',
    firstName: 'John',
    lastName: 'Stanton',
  })

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
    expect.assertions(4)

    // Create a dummy user.
    const savedUser = await user.save()
    expect(savedUser).toHaveProperty('_id')
    expect(savedUser).toMatchObject({
      provider: {
        name: 'google',
        id: (Math.floor(Math.random * 1000000000) + 1).toString(),
      },
      email: 'dummymail@gmail.com',
      firstName: 'John',
      lastName: 'Stanton',
    })

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
})
