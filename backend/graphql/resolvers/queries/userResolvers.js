import User from '../../../database/models/user'
import { GET_USER_BY_ID, GET_ALL_USERS } from '../../../database/operations'
import AuthenticationError from '../../../errors/AuthenticationError'
import AuthorizationError from '../../../errors/AuthorizationError'

const usersResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    if (!user.isAuthorizedTo(GET_ALL_USERS)) {
      throw new AuthorizationError()
    }
    const userList = await User.find(args.filters).sort(args.orderBy)
    return userList
  } catch (err) {
    throw err
  }
}

const userResolver = async (parent, args, context) => {
  // eslint-disable-next-line no-shadow
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    if (!user.isAuthorizedTo(GET_USER_BY_ID)) {
      throw new AuthorizationError()
    }
    const userStored = await User.findById(args.id)
    return userStored
  } catch (err) {
    throw err
  }
}

export { usersResolver, userResolver }
