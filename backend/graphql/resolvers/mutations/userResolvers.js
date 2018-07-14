import User from '../../../database/models/user'
import { CHANGE_USER_ROLE, UPDATE_USER } from '../../../database/operations'
import { pick } from '../../../utils'
import {
  AuthenticationError,
  AuthorizationError,
  OrderPendingError,
  InvalidRolesError,
} from '../../../errors/'

// This resolver is not required.
const addUserResolver = async (parent, args, context) => {
  const { user } = context
  if (user) {
    throw new AuthenticationError()
  }

  try {
    return await User.create(args)
  } catch (err) {
    throw err
  }
}

// This resolver is not required.
const removeUserResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    // Check if user has any undelivered orders.
    user.order.forEach(order => {
      if (order.status !== 'Delivered') {
        throw new OrderPendingError()
      }
    })

    return await User.findByIdAndRemove(args.id)
  } catch (err) {
    throw err
  }
}

// Based on the fact that updateUser mutation only allows updation of
// name and phone number.
const updateUserResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(UPDATE_USER)) {
      throw new AuthorizationError()
    }
    const userArgs = pick(args, ['firstName', 'lastName', 'phone'])

    const updatedUser = await User.findByIdAndUpdate(user._id, userArgs, {
      new: true,
      runValidators: true,
    })
    return updatedUser
  } catch (err) {
    throw err
  }
}

const changeUserRoleResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(CHANGE_USER_ROLE)) {
      throw new AuthorizationError()
    }

    const { id, roles } = args
    if (!roles) {
      throw new InvalidRolesError()
    }

    return await User.findByIdAndUpdate(
      id,
      { roles },
      { new: true, runValidators: true }
    )
  } catch (err) {
    throw err
  }
}

export {
  addUserResolver,
  removeUserResolver,
  updateUserResolver,
  changeUserRoleResolver,
}
