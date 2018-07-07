import { Types } from 'mongoose'

import Address from '../../../database/models/address'
import User from '../../../database/models/user'
import { pick } from '../../../utils'
import {
  ADD_ADDRESS,
  REMOVE_ADDRESS,
  UPDATE_ADDRESS,
} from '../../../database/operations'
import { AppError } from '../../../Errors/error'
import {
  AddAddressError,
  UpdateAddressError,
} from '../../../Errors/addressError'
import { PermitError } from '../../../Errors/permitError'
import { AuthError } from '../../../Errors/authError'
import {
  PermitUpdateAddressError,
  PermitDeleteAddressError,
  UserFindError,
} from '../../../Errors/permitAddressError'

const addAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthError()
  }
  // New address created should have a predefined ID.
  args._id = new Types.ObjectId()
  try {
    if (!user.isAuthorizedTo(ADD_ADDRESS)) {
      throw new PermitError()
    }
    // Save address to Address collection.
    const address = await Address(args).save()
    if (!address) {
      throw new AddAddressError()
    }

    // Add address to User's list of addresses.
    const savedUser = await User.findById(user._id)
    savedUser.address.push(address._id)
    await savedUser.save()
    if (!savedUser) {
      throw new UpdateAddressError()
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
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(REMOVE_ADDRESS)) {
      throw new PermitError()
    }
    const savedUser = await User.findById(user._id)
    if (!savedUser) {
      throw new UserFindError()
    }

    // Check if address ID provided is in user's list of addresses.
    const index = savedUser.address.indexOf(args.id)
    if (index === -1) {
      throw new PermitDeleteAddressError()
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

const updateAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(UPDATE_ADDRESS)) {
      throw new PermitError()
    }
    const savedUser = await User.findById(user._id).populate('order')
    if (!savedUser) {
      throw new UserFindError()
    }

    // Check if address ID provided is in user's list of addresses.
    const index = savedUser.address.indexOf(args.id)
    if (index === -1) {
      throw new PermitUpdateAddressError()
    }

    // Check if an order by the user contains this address.
    let addressInOrder = false
    savedUser.order.forEach(order => {
      if (order.shippingAddress.toString() === args.id.toString()) {
        addressInOrder = true
      }
    })

    if (!addressInOrder) {
      // If address isn't used by any order, then it is safe to update it.
      const updatedAddress = await Address.findByIdAndUpdate(
        { _id: args.id },
        args,
        {
          new: true,
          runValidators: true,
        }
      )
      if (!updatedAddress) {
        throw new UpdateAddressError()
      }
      return updatedAddress
    }

    // Else, create a new address and just update the ID in user's list of addresses.
    const addressArgs = pick(args, [
      'address1',
      'address2',
      'landmark',
      'city',
      'state',
      'zip',
      'country',
    ])
    const newAddress = await new Address(addressArgs).save()

    savedUser.address.splice(index, 1, newAddress._id)
    await savedUser.save()

    return newAddress
  } catch (err) {
    throw err
  }
}

export { addAddressResolver, removeAddressResolver, updateAddressResolver }
