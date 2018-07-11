/* eslint-env jest */

import { ValidationError, Types } from 'mongoose'

import User from '../../database/models/user'
import {
  updateUserResolver,
  changeUserRoleResolver,
} from '../../graphql/resolvers/mutations/userResolvers'
import { merge } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'
import {
  AuthenticationError,
  AuthorizationError,
  InvalidRolesError,
} from '../../errors'

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
    await User.findByIdAndUpdate(
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
    await User.findByIdAndUpdate(
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
    ).rejects.toThrow(new AuthenticationError())
  })

  it('Should not update when a field is invalid', async () => {
    expect.assertions(1)
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

describe('changeUserRole resolver', () => {
  const user = {
    _id: '5b39f7bb26670102359a8c10',
  }

  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
    roles: ['user'],
  }

  it(`Should update a user's roles`, async () => {
    expect.assertions(4)
    const savedUser = await User.findById(user._id)
    const newUser = await User.create(dummyUser)

    const args = {
      id: newUser._id,
      roles: ['user', 'admin'],
    }

    const updatedUser = await changeUserRoleResolver(null, args, {
      user: savedUser,
    })

    expect(updatedUser).toHaveProperty('roles')
    expect(updatedUser.roles).toHaveLength(2)
    expect(updatedUser.roles).toContain('user')
    expect(updatedUser.roles).toContain('admin')

    // Cleanup.
    await User.findByIdAndRemove(newUser._id)
  })

  it(`Should not update a user's roles when there is no user to authorize`, async () => {
    expect.assertions(1)
    const newUser = await User.create(dummyUser)

    const args = {
      id: newUser._id,
      roles: ['user', 'admin'],
    }

    await expect(changeUserRoleResolver(null, args, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(newUser._id)
  })

  it(`Should not update a user's roles when the user trying to change user's role is not authorized`, async () => {
    expect.assertions(1)
    const unauthorizedUser = await User.create(
      merge(dummyUser, { email: 'Antonetta_Prohaska94@yahoo.com' })
    )
    const newUser = await User.create(dummyUser)

    const args = {
      id: newUser._id,
      roles: ['user', 'admin'],
    }

    await expect(
      changeUserRoleResolver(null, args, { user: unauthorizedUser })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await User.deleteMany({ _id: { $in: [unauthorizedUser._id, newUser._id] } })
  })

  it(`Should not update a user's roles when roles aren't provided`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const newUser = await User.create(dummyUser)

    const args = {
      id: newUser._id,
    }

    await expect(
      changeUserRoleResolver(null, args, {
        user: savedUser,
      })
    ).rejects.toThrow(new InvalidRolesError())

    // Cleanup.
    await User.findByIdAndRemove(newUser._id)
  })

  it(`Should not update a user's roles when 'roles' field is an empty array`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const newUser = await User.create(dummyUser)

    const args = {
      id: newUser._id,
      roles: [],
    }

    await expect(
      changeUserRoleResolver(null, args, {
        user: savedUser,
      })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(newUser._id)
  })

  it(`Should not update a user's roles when roles aren't one of the predefined roles`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)
    const newUser = await User.create(dummyUser)

    const args = {
      id: newUser._id,
      roles: ['blah', 'lorem', 'ipsum'],
    }

    await expect(
      changeUserRoleResolver(null, args, {
        user: savedUser,
      })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.findByIdAndRemove(newUser._id)
  })

  it(`Should not update a user's roles when ID is invalid`, async () => {
    expect.assertions(1)
    const savedUser = await User.findById(user._id)

    const args = {
      id: new Types.ObjectId(),
      roles: ['user', 'admin'],
    }

    const updatedUser = await changeUserRoleResolver(null, args, {
      user: savedUser,
    })
    expect(updatedUser).toBeNull()
  })
})
