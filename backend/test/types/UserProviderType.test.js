/* eslint-env jest */

import { GraphQLNonNull, GraphQLString } from 'graphql'

import UserProviderType from '../../graphql/types/UserProviderType'

describe('UserProviderInput', () => {
  it('Should have a non-nullable name field of type String', () => {
    expect(UserProviderType.getFields()).toHaveProperty('name')
    expect(UserProviderType.getFields().name.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable id field of type String', () => {
    expect(UserProviderType.getFields()).toHaveProperty('id')
    expect(UserProviderType.getFields().id.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
