/* eslint-env jest */

import { ValidationError } from 'mongoose'

import User from '../../database/models/user'
import { updateUserResolver } from '../../graphql/resolvers/userResolvers'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('updateUser resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
  }

  const firstNames = ['Icie', 'Kirk', 'Sophie', 'Quentin', 'Forest']
  const lastNames = ['Little', 'Hauck', 'Gislason', 'Wiegand', 'Dietrich']
  const phoneNumbers = [
    '378-748-5678',
    '748-191-9467',
    '848-787-9259',
    '030-004-7609',
    '954-259-8960',
  ]

  const generateFirstName = () => {
    const firstNameIndex = Math.floor(Math.random() * firstNames.length)
    return firstNames[firstNameIndex]
  }

  const generateLastName = () => {
    const lastNameIndex = Math.floor(Math.random() * lastNames.length)
    return lastNames[lastNameIndex]
  }

  const generatePhoneNumber = () => {
    const phoneIndex = Math.floor(Math.random() * phoneNumbers.length)
    return phoneNumbers[phoneIndex]
  }

  it(`Should update user's name`, async () => {
    expect.assertions(4)
    const savedUser = await User.findById(user._id)
    const { firstName, lastName, name } = savedUser
    const dummyFirstName = generateFirstName()
    const dummyLastName = generateLastName()
    const updatedUser = await updateUserResolver(
      null,
      { firstName: dummyFirstName, lastName: dummyLastName },
      { user: savedUser }
    )

    expect(updatedUser).toHaveProperty('_id')
    expect(updatedUser._id).toEqual(savedUser._id)
    expect(updatedUser.name).not.toEqual(name)
    expect(updatedUser.name).toEqual(`${dummyFirstName} ${dummyLastName}`)

    // Cleanup.
    await User.findOneAndUpdate(
      { _id: updatedUser._id },
      { firstName, lastName },
      { runValidators: true }
    )
  })

  it(`Should update user's phone`, async () => {
    expect.assertions(5)
    const savedUser = await User.findById(user._id)
    const { firstName, lastName, phone } = savedUser
    const dummyPhoneNumber = generatePhoneNumber()
    const updatedUser = await updateUserResolver(
      null,
      {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        phone: dummyPhoneNumber,
      },
      { user: savedUser }
    )

    expect(updatedUser).toHaveProperty('_id')
    expect(updatedUser._id).toEqual(savedUser._id)
    expect(updatedUser.phone).not.toEqual(phone)
    expect(updatedUser.phone).toEqual(dummyPhoneNumber)
    expect(updatedUser.name).toEqual(`${savedUser.name}`)

    // Cleanup.
    await User.findOneAndUpdate(
      { _id: updatedUser._id },
      { firstName, lastName, phone },
      { runValidators: true }
    )
  })

  it('Should not update when there is no user', async () => {
    expect.assertions(1)
    const dummyFirstName = generateFirstName()
    const dummyLastName = generateLastName()
    const dummyPhoneNumber = generatePhoneNumber()

    await expect(
      updateUserResolver(
        null,
        {
          firstName: dummyFirstName,
          lastName: dummyLastName,
          phone: dummyPhoneNumber,
        },
        {}
      )
    ).rejects.toThrow('Must be logged in')
  })

  it('Should not update when a field is invalid', async () => {
    // expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const { firstName, lastName } = savedUser
    const dummyPhoneNumber = 'possimus doloribus ut'
    await expect(
      updateUserResolver(
        null,
        { firstName, lastName, phone: dummyPhoneNumber },
        { user: savedUser }
      )
    ).rejects.toThrowError(ValidationError)
  })
})
