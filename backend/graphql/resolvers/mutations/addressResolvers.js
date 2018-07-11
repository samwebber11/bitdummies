import { Types } from 'mongoose'

import Address from '../../../database/models/address'
import User from '../../../database/models/user'
import { pick } from '../../../utils'
import {
  ADD_ADDRESS,
  REMOVE_ADDRESS,
  UPDATE_ADDRESS,
} from '../../../database/operations'
import {
  AuthenticationError,
  AuthorizationError,
  AddressUnassociatedError,
} from '../../../errors/'

const addAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  // New address created should have a predefined ID.
  args._id = new Types.ObjectId()
  try {
    if (!user.isAuthorizedTo(ADD_ADDRESS)) {
      throw new AuthorizationError()
    }

    // Save address to Address collection.
    const address = await Address.create(args)

    // Add address to User's list of addresses.
    const savedUser = await User.findById(user._id)
    savedUser.address.push(address._id)
    await savedUser.save()

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
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(REMOVE_ADDRESS)) {
      throw new AuthorizationError()
    }

    // Check if address ID provided is in user's list of addresses.
    const index = user.address.indexOf(args.id)
    if (index === -1) {
      throw new AddressUnassociatedError()
    }

    // Delete from user's list of addresses.
    await User.findByIdAndUpdate(user._id, { $pull: { address: args.id } })
    const updatedUser = await User.findById(user._id)
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

const updateAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(UPDATE_ADDRESS)) {
      throw new AuthorizationError()
    }

    // Check if address ID provided is in user's list of addresses.
    const index = user.address.indexOf(args.id)
    if (index === -1) {
      throw new AddressUnassociatedError()
    }

    const addressArgs = pick(args, [
      'address1',
      'address2',
      'landmark',
      'city',
      'state',
      'zip',
      'country',
    ])

    // Check if an order by the user contains this address.
    let addressInOrder = false
    const userWithOrders = await User.findById(user._id).populate('order')
    userWithOrders.order.forEach(order => {
      if (order.shippingAddress.toString() === args.id.toString()) {
        addressInOrder = true
      }
    })

    if (!addressInOrder) {
      // If address isn't used by any order, then it is safe to update it.
      const updatedAddress = await Address.findByIdAndUpdate(
        args.id,
        addressArgs,
        {
          new: true,
          runValidators: true,
        }
      )

      return updatedAddress
    }

    // Else, create a new address and just update the ID in user's list of addresses.
    const newAddress = await Address.create(addressArgs)
    const savedUser = await User.findById(user._id)
    savedUser.address.splice(index, 1, newAddress._id)
    await savedUser.save()

    return newAddress
  } catch (err) {
    throw err
  }
}

export { addAddressResolver, removeAddressResolver, updateAddressResolver }
