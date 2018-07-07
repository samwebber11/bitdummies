import Product from '../../../database/models/product'
import { pick } from '../../../utils'

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
    throw new Error('Unauthorized')
  }

  try {
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
