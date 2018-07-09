import Order from '../../../database/models/order'
import Product from '../../../database/models/product'
import Address from '../../../database/models/address'
import User from '../../../database/models/user'
import {
  ADD_ORDER,
  CANCEL_ORDER,
  REMOVE_PRODUCT_FROM_ORDER,
  CHANGE_ORDER_STATUS,
} from '../../../database/operations'
import AuthenticationError from '../../../errors/AuthenticationError'
import AuthorizationError from '../../../errors/AuthorizationError'
import InvalidArgsError from '../../../errors/InvalidArgsError'
import InvalidQuantityError from '../../../errors/InvalidQuantityError'
import InvalidSizeError from '../../../errors/InvalidSizeError'
import AddressNotFoundError from '../../../errors/AddressNotFoundError'
import AddressUnassociatedError from '../../../errors/AddressUnassociatedError'
import OrderNotFoundError from '../../../errors/OrderNotFoundError'
import OrderCancellationError from '../../../errors/OrderCancellationError'
import OrderUnassociatedError from '../../../errors/OrderUnassociatedError'
import ProductNotFoundError from '../../../errors/ProductNotFoundError'
import ProductUnassociatedError from '../../../errors/ProductUnassociatedError'
import InvalidOrderStatusError from '../../../errors/InvalidOrderStatusError'

const addOrderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    // Check if user is Authorized to perform this operation
    if (!user.isAuthorizedTo(ADD_ORDER)) {
      throw new AuthorizationError()
    }

    // Make sure products were provided.
    if (!args.products || !args.products.length || args.products.length === 0) {
      throw new InvalidArgsError()
    }

    // Fetch the products from the database.
    const productIDs = args.products.map(product => product.product)
    const dbProducts = await Product.find(
      { _id: { $in: productIDs } },
      'actualPrice discount tax size'
    )

    // Check whether each product was found in the database or not.
    if (!dbProducts || dbProducts.length !== productIDs.length) {
      throw new ProductNotFoundError()
    }

    // Check whether the quantity requested for each product is within limit.
    args.products.forEach(product => {
      const pro = dbProducts.find(
        dbProduct => dbProduct._id.toString() === product.product.toString()
      )
      const proSize = pro.size.find(size => size.label === product.size)

      const quantityRequired = product.quantity
      const { quantityAvailable } = proSize
      if (quantityRequired > quantityAvailable) {
        throw new InvalidQuantityError()
      }
    })

    // Check if the address is valid or not.
    const address = await Address.findById(args.shippingAddress)
    if (!address) {
      throw new AddressNotFoundError()
    }

    // Check whether the address is contained in the user's list of addresses.
    const addressInUserAddresses = user.address.find(
      userAddress => userAddress.toString() === address._id.toString()
    )
    if (!addressInUserAddresses) {
      throw new AddressUnassociatedError()
    }

    // TODO: Check for payment here.

    // Update the products in the database to reflect the decrease in quantity.
    await Promise.all(
      args.products.map(async product => {
        // For each product in the order, find the corresponding product in the database.
        const pro = dbProducts.find(
          dbProduct => dbProduct._id.toString() === product.product.toString()
        )

        // Find the corresponding size for the size requested, and decrease the quantity.
        const index = pro.size.findIndex(size => size.label === product.size)
        if (index === -1) {
          throw new InvalidSizeError()
        }
        pro.size[index].quantityAvailable -= product.quantity

        // Reflect the change in quantity to the database.
        await Product.findByIdAndUpdate(
          pro._id,
          { size: pro.size },
          { new: true, runValidators: true }
        )
      })
    )

    // Create a list of products that have been ordered, for saving to the database.
    const orderedProducts = args.products.map(product => {
      const { actualPrice, discount, discountedPrice, tax } = dbProducts.find(
        pro => pro._id.toString() === product.product.toString()
      )

      return {
        product: product.product,
        quantity: product.quantity,
        size: product.size,
        actualPrice,
        tax,
        discount,
        discountedPrice,
      }
    })

    // Save the order to the database.
    const order = await Order.create({
      products: orderedProducts,
      status: 'Processing',
      payment: {
        status: 'Paid',
        mode: 'E-wallet',
        transactionID: Math.floor(Math.random() * 1000000 + 1).toString(),
      },
      shippingAddress: address._id,
      orderedAt: Date.now(),
    })

    // Also, add the order to the user's list of orders.
    await User.findByIdAndUpdate(user._id, { $push: { order: order._id } })

    return order
  } catch (err) {
    throw err
  }
}

const cancelOrderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(CANCEL_ORDER)) {
      throw new AuthorizationError()
    }
    // Find the order and check that its status is 'Processing'.
    const order = await Order.findById(args.id)
    if (!order) {
      throw new OrderNotFoundError()
    }
    if (order.status !== 'Processing') {
      throw new OrderCancellationError()
    }

    // Check to see if the order is in the user's list of orders.
    const orderIndex = user.order.findIndex(
      userOrder => userOrder.toString() === args.id.toString()
    )
    if (orderIndex === -1) {
      throw new OrderUnassociatedError()
    }

    // Update the products in the database to reflect the increase in quantity.
    await Promise.all(
      order.products.map(async product => {
        // For each product in the order, find the corresponding product in the database.
        const pro = await Product.findById(product.product)
        if (!pro) {
          throw new ProductNotFoundError()
        }

        // Find the corresponding size of the product, and increase the quantity.
        const index = pro.size.findIndex(size => size.label === product.size)
        if (index === -1) {
          throw new InvalidSizeError()
        }
        pro.size[index].quantityAvailable += product.quantity

        // Reflect the change in quantity to the database.
        await Product.findByIdAndUpdate(
          product.product,
          {
            size: pro.size,
          },
          { new: true, runValidators: true }
        )
      })
    )

    // Remove the order from the user's list of orders and save to the database.
    await User.findByIdAndUpdate(user._id, { $pull: { order: order._id } })

    // Remove the order from the database.
    return await Order.findByIdAndRemove(args.id)
  } catch (err) {
    throw err
  }
}

const removeProductFromOrderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(REMOVE_PRODUCT_FROM_ORDER)) {
      throw new AuthorizationError()
    }
    // Find the order and check that its status is 'Processing'.
    const order = await Order.findById(args.id)
    if (!order) {
      throw new OrderNotFoundError()
    }
    if (order.status !== 'Processing') {
      throw new OrderCancellationError()
    }

    // Check to see if the order is in the user's list of orders.
    const orderInUserOrders = user.order.find(
      userOrder => userOrder.toString() === order._id.toString()
    )
    if (!orderInUserOrders) {
      throw new OrderUnassociatedError()
    }

    // Check that the product ID is valid.
    const product = await Product.findById(args.product)
    if (!product) {
      throw new ProductNotFoundError()
    }

    // Check that the order contains the provided product ID.
    const productIndex = order.products.findIndex(
      pro => pro.product.toString() === args.product.toString()
    )
    if (productIndex === -1) {
      throw new ProductUnassociatedError()
    }

    // Find the corresponding size for the product, and increase the quantity.
    const sizeIndex = product.size.findIndex(
      size => size.label === order.products[productIndex].size
    )
    if (sizeIndex === -1) {
      throw new InvalidSizeError()
    }
    product.size[sizeIndex].quantityAvailable +=
      order.products[productIndex].quantity

    // Reflect the increase in product quantity to the database.
    await Product.findByIdAndUpdate(
      args.product,
      {
        size: product.size,
      },
      { new: true, runValidators: true }
    )

    // Remove the product from the order.
    order.products.splice(productIndex, 1)
    return await order.save()
  } catch (err) {
    throw err
  }
}

const changeOrderStatusResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }

  try {
    if (!user.isAuthorizedTo(CHANGE_ORDER_STATUS)) {
      throw new AuthorizationError()
    }
    const { id, status } = args
    if (!status || typeof status !== 'string') {
      throw new InvalidOrderStatusError()
    }

    // Find the order and change the status.
    return await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
  } catch (err) {
    throw err
  }
}

export {
  addOrderResolver,
  cancelOrderResolver,
  removeProductFromOrderResolver,
  changeOrderStatusResolver,
}
