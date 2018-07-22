/* eslint-env jest */

import { Types, ValidationError } from 'mongoose'

import User from '../../database/models/user'
import {
  userResolver,
  usersResolver,
} from '../../graphql/resolvers/queries/userResolvers'

import { pick, compareValues } from '../../utils'
import { connectMongoose, disconnectMongoose } from '../helper'
import { AuthenticationError, AuthorizationError } from '../../errors'

// import { forEach } from 'iterall'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('users resolver', () => {
  const dummyUser1 = {
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

  const dummyUser2 = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'marcus.runte68@yahoo.com',
    firstName: 'Icie',
    lastName: 'Little',
    phone: '378-456-8956',
  }

  const dummyUser3 = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'adam.nicho787@gmail.com',
    firstName: 'Adam',
    lastName: 'Nicholos',
    phone: '845-658-4522',
  }
  const dummyUser4 = {
    provider: {
      name: 'facebook',
      id: Math.floor(Math.random() * 1000000).toString(),
    },
    email: 'little.robi22@hotmail.com',
    firstName: 'Roberto',
    lastName: 'Little',
    phone: '885-989-6587',
  }
  const dummyUnauthorizedUser = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 10000000 + 1).toString(),
    },
    email: 'Ernestine66@hotmail.com',
    firstName: 'Oma',
    lastName: 'Emard',
    phone: '857-857-6658',
  }

  it('Should fetch all users', async () => {
    expect.assertions(7)

    // Setup.
    const userList = [dummyUser2, dummyUser3, dummyUser4]
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
    const user = await User.create(dummyUser1)

    // Actual test begins.
    const fetchedUserList = await usersResolver(null, {}, { user })
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)
    expect(fetchedUserList[0]).toHaveProperty('firstName')
    expect(fetchedUserList[0]).toHaveProperty('lastName')
    expect(fetchedUserList[0]._id).not.toBeUndefined()
    expect(fetchedUserList[0]).toHaveProperty('email')
    expect(fetchedUserList[0]).toHaveProperty('address')
    expect(fetchedUserList[0]).toHaveProperty('order')

    // CleanUp.
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
    await User.findByIdAndRemove(user._id)
  })

  it('Should fetch users in order by their firstname', async () => {
    expect.assertions(3)

    // Setup.
    const userList = [dummyUser2, dummyUser3, dummyUser4]
    userList.sort(compareValues('firstName', 'asc'))
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])

    // Actual test begins.
    const fetchedUserList = await usersResolver(
      null,
      { orderBy: { firstName: 'asc' } },
      {
        user,
      }
    )

    expect(fetchedUserList[0]).toHaveProperty('firstName')
    expect(fetchedUserList[0].firstName).toBe(userList[0].firstName)
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  it('Should fetch users in order by their lastname', async () => {
    expect.assertions(3)

    // Setup.
    const userList = [dummyUser2, dummyUser3, dummyUser4]
    userList.sort(compareValues('lastName', 'desc'))
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])

    // Actual test begins
    const fetchedUserList = await usersResolver(
      null,
      { orderBy: { lastName: 'desc' } },
      { user }
    )
    expect(fetchedUserList[0]).toHaveProperty('lastName')
    expect(fetchedUserList[0].lastName).toBe(userList[0].lastName)
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  it('Should fetch users filtered by firstName', async () => {
    expect.assertions(3)

    // Setup.
    let userList = [dummyUser2, dummyUser3, dummyUser4]
    userList = userList.filter(val => val.firstName === 'Icie')
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
    const arg = pick(users[0], ['firstName'])

    // Actual test begins.
    const fetchedUserList = await usersResolver(
      null,
      { filters: arg },
      { user }
    )
    expect(fetchedUserList[0]).toHaveProperty('firstName')
    expect(fetchedUserList[0].firstName).toBe(userList[0].firstName)
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  it('Should fetch users filtered by lastName', async () => {
    expect.assertions(3)

    // Setup.
    let userList = [dummyUser2, dummyUser3, dummyUser4]
    userList = userList.filter(val => val.lastName === 'Little')
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
    const arg = pick(users[0], ['lastName'])

    // Actual test begins.
    const fetchedUserList = await usersResolver(
      null,
      { filters: arg },
      { user }
    )

    expect(fetchedUserList[0]).toHaveProperty('lastName')
    expect(fetchedUserList[0].lastName).toBe(userList[0].lastName)
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  it('Should fetch users filtered by email', async () => {
    expect.assertions(3)

    // Setup.
    let userList = [dummyUser2, dummyUser3, dummyUser4]
    userList = userList.filter(val => val.email === 'marcus.runte68@yahoo.com')
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
    const arg = pick(users[0], ['email'])

    // Actual test begins.
    const fetchedUserList = await usersResolver(
      null,
      { filters: arg },
      { user }
    )

    expect(fetchedUserList[0]).toHaveProperty('email')
    expect(fetchedUserList[0].email).toBe(userList[0].email)
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  it('Should fetch users filtered by phone', async () => {
    expect.assertions(3)

    // Setup.
    let userList = [dummyUser2, dummyUser3, dummyUser4]
    userList = userList.filter(val => val.phone === '378-456-8956')
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
    const arg = pick(users[0], ['phone'])

    // Actual test begins.
    const fetchedUserList = await usersResolver(
      null,
      { filters: arg },
      { user }
    )
    expect(fetchedUserList[0]).toHaveProperty('phone')
    expect(fetchedUserList[0].phone).toBe(userList[0].phone)
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  // it('Should fetch users filtered by provider name', async () => {
  //   expect.assertions(3)

  //   // Setup.
  //   let userList = [dummyUser2, dummyUser3, dummyUser4]
  //   userList = userList.filter(val => val.provider.name === 'google')
  //   const user = await User.create(dummyUser1)
  //   const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
  //   // Actual test begins.
  //   const fetchedUserList = await usersResolver(
  //     null,
  //     { filters: 'provider' },
  //     { user }
  //   )
  //   // console.log(fetchedUserList)

  //   expect(fetchedUserList.length).not.toBeNull()
  //   expect(fetchedUserList[0]).toHaveProperty('provider')
  //   expect(fetchedUserList[0].provider.name).toBe(userList[0].provider.name)
  //   // expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)

  //   // CleanUp.
  //   await User.findByIdAndRemove(user._id)
  //   const userIDs = await users.map(val => val._id)
  //   await User.deleteMany({
  //     _id: { $in: userIDs },
  //   })
  // })

  it('Should fetch users filtered by lastname and sorted by firstname', async () => {
    expect.assertions(5)

    // Setup.
    let userList = [dummyUser2, dummyUser3, dummyUser4]
    userList = userList.filter(val => val.lastName === 'Little')
    userList.sort(compareValues('firstName', 'asc'))
    const user = await User.create(dummyUser1)
    const users = await User.insertMany([dummyUser2, dummyUser3, dummyUser4])
    const arg = pick(users[0], ['lastName'])

    // Actual test begins.
    const fetchedUserList = await usersResolver(
      null,
      {
        orderBy: { firstName: 'asc' },
        filters: arg,
      },
      { user }
    )

    expect(fetchedUserList[0]).toHaveProperty('firstName')
    expect(fetchedUserList[0]).toHaveProperty('lastName')
    expect(fetchedUserList.length).toBeGreaterThanOrEqual(userList.length)
    expect(fetchedUserList[0].firstName).toBe(userList[0].firstName)
    expect(fetchedUserList[0].lastName).toBe(userList[0].lastName)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
    const userIDs = await users.map(val => val._id)
    await User.deleteMany({
      _id: { $in: userIDs },
    })
  })

  it('Should not fetch a user if the user is not authorized', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUnauthorizedUser)
    const userPayload = await User.create(dummyUser1)
    const arg = pick(userPayload, ['firstName'])

    // Actual test begins.
    await expect(
      usersResolver(
        null,
        { orderBy: { firstName: 'asc' }, filters: arg },
        { user }
      )
    ).rejects.toThrow(new AuthorizationError())

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, userPayload._id] } })
  })

  it('Should not fetch a user if there is no user', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser1)
    const userPayload = await User.create(dummyUser2)
    const arg = pick(userPayload, ['lastName'])

    // Actual test begins.
    expect(usersResolver(null, { filters: arg }, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, userPayload._id] } })
  })
})

describe('user resolver', () => {
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

  const dummyUserPayLoad = {
    provider: {
      name: 'google',
      id: Math.floor(Math.random() * 1000000 + 1).toString(),
    },
    email: 'marcus.runte68@yahoo.com',
    firstName: 'Icie',
    lastName: 'Little',
    phone: '378-456-8956',
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

  it(`Should fetch a user`, async () => {
    expect.assertions(13)

    // Setup.
    const user = await User.create(dummyUser)
    const userPayload = await User.create(dummyUserPayLoad)
    const args = { id: userPayload._id }

    // Actual test begins.
    const fetchedUser = await userResolver(null, args, {
      user,
    })

    expect(fetchedUser).toHaveProperty('_id')
    expect(fetchedUser._id).toEqual(userPayload._id)
    expect(fetchedUser).toHaveProperty('firstName')
    expect(fetchedUser.firstName).toBe(userPayload.firstName)
    expect(fetchedUser).toHaveProperty('lastName')
    expect(fetchedUser.lastName).toBe(userPayload.lastName)
    expect(fetchedUser).toHaveProperty('email')
    expect(fetchedUser.email).toBe(userPayload.email)
    expect(fetchedUser).toHaveProperty('phone')
    expect(fetchedUser.phone).toBe(userPayload.phone)
    expect(fetchedUser).toHaveProperty('address')
    expect(fetchedUser).toHaveProperty('order')
    expect(fetchedUser.name).toBe(userPayload.name)

    // Cleanup.
    await User.deleteMany({ _id: { $in: [user._id, userPayload._id] } })
  })

  it('Should not fetch a user if the user is not authorized', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUnauthorizedUser)
    const args = { id: user._id }

    // Actual test begins.
    await expect(userResolver(null, args, { user })).rejects.toThrow(
      new AuthorizationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })

  it('Should not fetch a user if the user is not present', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser)
    const arg = await new Types.ObjectId()

    // Actual test begins.
    expect(userResolver(null, arg, { user })).rejects.toThrow(ValidationError)

    // CleanUp.
    await User.findByIdAndRemove(user._id)
  })
  it('Should not fetch a user if there is no user', async () => {
    expect.assertions(1)

    // Setup.
    const user = await User.create(dummyUser)
    const userPayload = await User.create(dummyUserPayLoad)
    const args = { id: userPayload._id }

    // Actual test begins.
    expect(userResolver(null, args, {})).rejects.toThrow(
      new AuthenticationError()
    )

    // Cleanup.
    await User.findByIdAndRemove(user._id)
  })
})
