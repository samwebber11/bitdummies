import Product from '../../../database/models/product'
import User from '../../../database/models/user'
import { pick } from '../../../utils'
import {
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  UPDATE_PRODUCT_INFO,
  UPDATE_PRODUCT_IMAGES,
  UPDATE_PRODUCT_QUANTITY,
} from '../../../database/operations'

const addProductResolver = async (parent, args, context) => {
  // TODO: Check for admin authorization here.
  const { user } = context
  if (!user) {
    throw new Error('Unauthenticated')
  }

  try {
    if (!user.isAuthorizedTo(ADD_PRODUCT)) {
      throw new Error('Unauthorized')
    }
    const product = await new Product(args).save()
    return product
  } catch (err) {
    throw err
  }
}

const removeProductResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Unauthenticated')
  }

  try {
    if (!user.isAuthorizedTo(REMOVE_PRODUCT)) {
      throw new Error('Unauthorized')
    }
    const removedProduct = await Product.findByIdAndRemove(args.id)
    return removedProduct
  } catch (err) {
    throw err
  }
}

const updateProductInfoResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Unauthenticated')
  }

  try {
    if (!user.isAuthorizedTo(UPDATE_PRODUCT_INFO)) {
      throw new Error('Unauthorized')
    }
    const productArgs = pick(args, [
      'name',
      'category',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'delicacy',
    ])

    const product = await Product.findByIdAndUpdate(args.id, productArgs, {
      new: true,
      runValidators: true,
    })
    return product
  } catch (err) {
    throw err
  }
}

const updateProductImagesResolver = async (parent, args, context) => {
  // TODO: Check for admin authorization here.
  const { user } = context
  if (!user) {
    throw new Error('Unauthenticated')
  }

  try {
    if (!user.isAuthorizedTo(UPDATE_PRODUCT_IMAGES)) {
      throw new Error('Unauthorized')
    }
    const productArgs = pick(args, ['imagePath'])
    const product = await Product.findByIdAndUpdate(args.id, productArgs, {
      new: true,
      runValidators: true,
    })
    return product
  } catch (err) {
    throw err
  }
}

const updateProductQuantityResolver = async (parent, args, context) => {
  // TODO: Check for admin authorization here.
  const { user } = context
  if (!user) {
    throw new Error('Unauthorized')
  }
  try {
    if (!user.isAuthorizedTo(UPDATE_PRODUCT_QUANTITY)) {
      throw new Error('Unauthorized')
    }
    const productArgs = pick(args, ['size'])

    if (!productArgs.size) {
      throw new Error('Must provide label and quantity for size')
    }

    const oldProduct = await Product.findById(args.id)
    if (!oldProduct) {
      return null
    }

    const sizes = oldProduct.size.map(size => ({
      label: size.label,
      quantityAvailable: size.quantityAvailable,
    }))

    // To ensure sizes are handled properly.
    // Combines both previous and new sizes.
    productArgs.size.forEach(newSize => {
      let sizeInCommon = false
      sizes.forEach(oldSize => {
        if (oldSize.label === newSize.label) {
          sizeInCommon = true
          oldSize.quantityAvailable = newSize.quantityAvailable
        }
      })

      if (!sizeInCommon) {
        sizes.push(newSize)
      }
    })

    const product = await Product.findByIdAndUpdate(
      args.id,
      { size: sizes },
      {
        new: true,
        runValidators: true,
      }
    )
    return product
  } catch (err) {
    throw err
  }
}

export {
  addProductResolver,
  removeProductResolver,
  updateProductInfoResolver,
  updateProductImagesResolver,
  updateProductQuantityResolver,
}
