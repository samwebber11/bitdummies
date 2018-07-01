import { Types } from 'mongoose'

import Address from '../../database/models/address'
import User from '../../database/models/user'

const addAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Must be logged in')
  }

  // User must not have more than 5 addresses.
  if (user.address.length === 5) {
    throw new Error('Cannot add more than 5 addresses')
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
    // Mapping all the addressIds associated with a particular user to have a check if there
    // is any address associated with the user. If no address is found then an error occurs otherwise
    // check the following address in the list of addresses.
    // const addressIds = user.map(address => address.address)
    // if (addressIds.length === 0) {
    //   throw new Error(
    //     'Could not find any address associated with the current user'
    //   )
    // }
    // addressIds.forEach(address => {
    //   if (user.order.shippingAddress._id === address) {
    //     if (
    //       user.order.status === 'Delivered' ||
    //       user.order.status === 'On Its Way' ||
    //       user.order.status === 'Delivered'
    //     ) {
    //       throw new Error('Cannot remove address')
    //     }
    //   }
    // })
    // // TODO: Check if this functions works right away
    // const id = args.id.valueOf()
    // const removeaddress = await Address.findByIdAndRemove(args.id)
    // if (!removeaddress) {
    //   throw new Error('Error occured in removing address')
    // }
    // user = await User.findByIdAndUpdate(userId, {
    //   address: addressIds.splice(addressIds.indexOf(id), 1),
    // })
    // // const dbAddress = await User.find((args.id: { $in: addressIds }))
    // return removeaddress
  } catch (err) {
    console.log('Error occured in removing address: ', err)
    throw err
  }
}

export { addAddressResolver, removeAddressResolver }
