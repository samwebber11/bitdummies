import User from '../../database/models/user'

// This resolver is not required.
const addUserResolver = async (parent, args, context) => {
  const { user } = context
  if (user) {
    throw new Error('Cannot create another account while signed in')
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
    throw new Error('Must be logged in')
  }

  try {
    // Check if user has any undelivered orders.
    user.order.forEach(order => {
      if (order.status !== 'Delivered') {
        throw new Error('Some orders are pending')
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
    throw new Error('Must be logged in')
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(user._id, args, {
      new: true,
      runValidators: true,
    })
    return updatedUser
  } catch (err) {
    throw err
  }
}

export { addUserResolver, removeUserResolver, updateUserResolver }
