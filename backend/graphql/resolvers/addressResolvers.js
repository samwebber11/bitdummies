import Address from '../../database/models/address'
import User from '../../database/models/user'

const addAddressResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Must be logged in')
  }

  try {
    // User must not have more than 5 addresses.
    if (user.address.length === 5) {
      throw new Error('Cannot add more than 5 addresses')
    }

    // Save the address to the `addresses` collection.
    let address = new Address(args)
    address = await address.save()
    if (!address) {
      throw Error('Error occurred in saving address')
    }

    // Then add the address ID to the list of addresses for the current user.
    const addressIDs = [...user.address, address._id]
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      address: addressIDs,
    })
    if (!updatedUser) {
      throw Error('Could not update address in User model')
    }

    return address
  } catch (err) {
    console.log('Error occurred in adding address: ', err)
    throw err
  }
}

const removeAddressResolver = true

export { addAddressResolver, removeAddressResolver }
