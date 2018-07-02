import Product from '../../database/models/product'
import { pick } from './utils'

const addProductResolver = async (parent, args, context) => {
  // TODO: Check for admin authorization here.
  const { user } = context
  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    const product = await new Product(args).save()
    return product
  } catch (err) {
    throw err
  }
}

const removeProductResolver = async (parent, args, context) => {
  // TODO: Check for admin authorization here.
  const { user } = context
  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    const removedProduct = await Product.findByIdAndRemove(args.id)
    return removedProduct
  } catch (err) {
    throw err
  }
}

const updateProductInfoResolver = async (parent, args, context) => {
  // TODO: Check for admin authorization here.
  const { user } = context
  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    const productArgs = pick(args, [
      'name',
      'category',
      'description',
      'actualPrice',
      'discount',
      'tax',
      'delicacy',
    ])
    const product = await Product.findOneAndUpdate(args.id, productArgs, {
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
    throw new Error('Unauthorized')
  }

  try {
    const product = await Product.findOneAndUpdate(
      args.id,
      { imagePath: args.imagePath },
      { new: true, runValidators: true }
    )
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
    const product = await Product.findOneAndUpdate(
      args.id,
      { size: args.size },
      { new: true, runValidators: true }
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
