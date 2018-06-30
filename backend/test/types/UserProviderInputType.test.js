/* eslint-env jest */

import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from 'graphql'

import UserProviderInputType from '../../graphql/types/UserProviderInputType'

describe('UserProviderInput', () => {
  it('Should be a InputObject type', () => {
    expect(UserProviderInputType).toBeInstanceOf(GraphQLInputObjectType)
  })

  it('Should have a non-nullable name field of type String', () => {
    expect(UserProviderInputType.getFields()).toHaveProperty('name')
    expect(UserProviderInputType.getFields().name.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })

  it('Should have a non-nullable id field of type String', () => {
    expect(UserProviderInputType.getFields()).toHaveProperty('id')
    expect(UserProviderInputType.getFields().id.type).toEqual(
      new GraphQLNonNull(GraphQLString)
    )
  })
})
