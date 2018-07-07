import User from '../../../database/models/user'
import { AppError } from '../../../Errors/error'
import { CHANGE_USER_ROLE, UPDATE_USER } from '../../../database/operations'
import { RoleChangeError, RoleCheckError } from '../../../Errors/roleError'\
import { AuthError } from '../../../Errors/authError'
import { PermitError } from '../../../Errors/permitError'
import { OrderPendingError} from '../../../Errors/orderError'

// This resolver is not required.
const addUserResolver = async (parent, args, context) => {
  const { user } = context
  if (user) {
    throw new RoleChangeError()
  }
  try {
    return await new User(args).save()
  } catch (err) {
    throw err
  }
}

// This resolver is not required.
const removeUserResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthError()
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
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(UPDATE_USER)) {
      throw new PermitError()
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, args, {
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
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(CHANGE_USER_ROLE)) {
      throw new PermitError()
    }

    const { id, roles } = args
    if (!roles) {
      throw new RoleCheckError()
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