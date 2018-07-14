/* eslint-env jest */

import { ValidationError, Types } from 'mongoose'

import User from '../../database/models/user'
import {
  updateUserResolver,
  changeUserRoleResolver,
} from '../../graphql/resolvers/mutations/userResolvers'
import { merge, pick } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'
import {
  AuthenticationError,
  AuthorizationError,
  InvalidRolesError,
} from '../../errors'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('updateUser resolver', () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
    phone: '657-588-9534',
  }

  const updatePayload = {
    email: 'marcus_runte68@yahoo.com',
    firstName: 'Icie',
    lastName: 'Little',
    phone: '378-748-5678',
  }

  it(`Should update user's name`, async () => {
    expect.assertions(5)
    // Setup.
    const user = await User.create(dummyUser)
    const userArgs = pick(updatePayload, ['firstName', 'lastName'])

    // Actual test begins.
    const updatedUser = await updateUserResolver(null, userArgs, { user })

    expect(updatedUser).toHaveProperty('_id')
    expect(updatedUser._id).toEqual(user._id)
    expect(updatedUser.name).not.toEqual(user.name)
    expect(updatedUser.name).toEqual(
      `${updatePayload.firstName} ${updatePayload.lastName}`
    )
    expect(updatedUser.phone).toEqual(user.phone)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it(`Should update user's phone`, async () => {
    expect.assertions(5)
    // Setup.
    const user = await User.create(dummyUser)
    const userArgs = pick(updatePayload, ['phone'])

    // Actual test begins.
    const updatedUser = await updateUserResolver(null, userArgs, { user })

    expect(updatedUser).toHaveProperty('_id')
    expect(updatedUser._id).toEqual(user._id)
    expect(updatedUser.phone).not.toEqual(user.phone)
    expect(updatedUser.phone).toEqual(updatePayload.phone)
    expect(updatedUser.name).toEqual(user.name)

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update when there is no user', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)

    await expect(updateUserResolver(null, updatePayload, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update a user when the user is not authorized to update the user', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['admin'] }))
    const userArgs = pick(updatePayload, ['firstName', 'lastName', 'phone'])

    // Actual test begins.
    await expect(updateUserResolver(null, userArgs, { user })).rejects.toThrow(
      new AuthorizationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not update when a field is invalid', async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)
    const userArgs = merge(
      pick(updatePayload, ['firstName', 'lastName', 'phone']),
      {
        phone: 'posiqueeli sehmad',
      }
    )

    // Actual test begins.
    await expect(updateUserResolver(null, userArgs, { user })).rejects.toThrow(
      ValidationError
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })
})

describe('changeUserRole resolver', async () => {
  const dummyUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    email: 'dexter.jacobi@gmail.com',
    firstName: 'Sedrick',
    lastName: 'Gulgowski',
    roles: ['admin'],
  }

  const dummyUnauthorizedUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
  }

  it(`Should update a user's roles`, async () => {
    expect.assertions(4)
    // Setup.
    const user = await User.create(dummyUser)
    const unauthorizedUser = await User.create(dummyUnauthorizedUser)
    const userArgs = {
      id: unauthorizedUser._id,
      roles: ['user', 'admin'],
    }

    // Actual test begins.
    const updatedUser = await changeUserRoleResolver(null, userArgs, { user })

    expect(updatedUser).toHaveProperty('roles')
    expect(updatedUser.roles).toHaveLength(2)
    expect(updatedUser.roles).toContain('user')
    expect(updatedUser.roles).toContain('admin')

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, unauthorizedUser._id] } })
  })

  it(`Should not update a user's roles when there is no user to authorize`, async () => {
    expect.assertions(1)
    // Setup.
    const unauthorizedUser = await User.create(dummyUnauthorizedUser)
    const userArgs = {
      id: unauthorizedUser._id,
      roles: ['user', 'admin'],
    }

    // Actual test begins.
    await expect(changeUserRoleResolver(null, userArgs, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(unauthorizedUser._id)
  })

  it(`Should not update a user's roles when the user trying to change user's role is not authorized`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(merge(dummyUser, { roles: ['user'] }))
    const unauthorizedUser = await User.create(dummyUnauthorizedUser)
    const userArgs = {
      id: unauthorizedUser._id,
      roles: ['user', 'admin'],
    }

    // Actual test begins
    await expect(
      changeUserRoleResolver(null, userArgs, { user })
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, unauthorizedUser._id] } })
  })

  it(`Should not update a user's roles when roles aren't provided`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)
    const unauthorizedUser = await User.create(dummyUnauthorizedUser)
    const userArgs = {
      id: unauthorizedUser._id,
    }

    // Actual test begins.
    await expect(
      changeUserRoleResolver(null, userArgs, { user })
    ).rejects.toThrow(new InvalidRolesError())

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, unauthorizedUser._id] } })
  })

  it(`Should not update a user's roles when 'roles' field is an empty array`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)
    const unauthorizedUser = await User.create(dummyUnauthorizedUser)

    const userArgs = {
      id: unauthorizedUser._id,
      roles: [],
    }

    // Actual test begins.
    await expect(
      changeUserRoleResolver(null, userArgs, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.deleteMany({ _id: { $in: [unauthorizedUser._id, user._id] } })
  })

  it(`Should not update a user's roles when roles aren't one of the predefined roles`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)
    const unauthorizedUser = await User.create(dummyUnauthorizedUser)
    const userArgs = {
      id: unauthorizedUser._id,
      roles: ['blah', 'lorem', 'ipsum'],
    }

    // Actual test begins.
    await expect(
      changeUserRoleResolver(null, userArgs, { user })
    ).rejects.toThrowError(ValidationError)

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, unauthorizedUser._id] } })
  })

  it(`Should not update a user's roles when ID is invalid`, async () => {
    expect.assertions(1)
    // Setup.
    const user = await User.create(dummyUser)
    const userArgs = {
      id: new Types.ObjectId(),
      roles: ['user', 'admin'],
    }

    // Actual test begins
    const updatedUser = await changeUserRoleResolver(null, userArgs, { user })
    expect(updatedUser).toBeNull()

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })
})
