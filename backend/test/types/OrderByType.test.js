/* eslint-env jest */

import OrderByType from '../../graphql/types/OrderByType'

describe('OrderBy', () => {
  it('should be an Enum type with values for asc and desc', () => {
    expect(OrderByType.getValue('asc')).toMatchObject({ value: 1 })
    expect(OrderByType.getValue('desc')).toMatchObject({ value: -1 })
  })
})
