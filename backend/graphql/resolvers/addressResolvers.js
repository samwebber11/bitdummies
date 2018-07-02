import { Types } from 'mongoose'

import Address from '../../database/models/address'
import User from '../../database/models/user'

const addAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Must be logged in')
  }

  // New address created should have a predefined ID.
  args._id = new Types.ObjectId()
  try {
    // Save address to Address collection.
    const address = await Address(args).save()
    if (!address) {
      throw new Error('Could not add address')
    }

    // Add address to User's list of addresses.
    const savedUser = await User.findById(user._id)
    savedUser.address.push(address._id)
    await savedUser.save()
    if (!savedUser) {
      throw new Error('Could not update address in User model')
    }
    return address
  } catch (err) {
    // Reaching here means that user may have reached  his limit for adding addresses.
    // Hence, remove.
    await Address.findByIdAndRemove(args._id)
    throw err
  }
}

const removeAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Must be logged in')
  }

  try {
    const savedUser = await User.findById(user._id)
    if (!savedUser) {
      throw new Error('Could not find user in User model')
    }

    // Check if address ID provided is in user's list of addresses.
    const index = savedUser.address.indexOf(args.id)
    if (index === -1) {
      throw new Error('Unauthorized to delete this address')
    }

    // Delete from user's list of addresses.
    savedUser.address.splice(index, 1)
    await savedUser.save()
    const updatedUser = await User.findById(savedUser._id)
      .populate('order')
      .populate('address')

    // Check if an order by the user contains this address.
    let addressInOrder = false
    updatedUser.order.forEach(order => {
      if (order.shippingAddress.toString() === args.id.toString()) {
        addressInOrder = true
      }
    })

    // Delete from address collection if NO order by the user contains this address.
    if (!addressInOrder) {
      await Address.findByIdAndRemove(args.id)
    }

    return updatedUser.address
  } catch (err) {
    throw err
  }
}

export { addAddressResolver, removeAddressResolver }
