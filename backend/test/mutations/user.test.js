/* eslint-env jest */

import { updateUserResolver } from '../../graphql/resolvers/userResolvers'
import { connectMongoose, disconnectMongoose } from '../helper'

beforeAll(connectMongoose)
afterAll(disconnectMongoose)

describe('updateUser resolver', () => {
  it('Should just run', () => {})
})
