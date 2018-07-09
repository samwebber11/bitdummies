import Address from '../../../database/models/address'
import { QUERY_ADDRESS, QUERY_ADDRESSES } from '../../../database/operations'
import { AuthenticationError, AuthorizationError } from '../../../errors/'

const addressesResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    if (!user.isAuthorizedTo(QUERY_ADDRESSES)) {
      throw new AuthorizationError()
    }
    const addressesList = await Address.find(args.filters).sort(args.orderBy)
    return addressesList
  } catch (err) {
    throw err
  }
}

const addressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    if (!user.isAuthorizedTo(QUERY_ADDRESS)) {
      throw new AuthorizationError()
    }
    const addressStored = await Address.findById(args.id)
    return addressStored
  } catch (err) {
    throw err
  }
}

export { addressesResolver, addressResolver }
