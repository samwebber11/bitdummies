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

import AppError from '../../../Errors/error'
import {
  AddOrderError,
  SaveOrderError,
  CheckStatusError,
  RemoveOrderError,
  CheckProductInOrderError,
  CheckOrderError,
  CancelOrderError,
  OrderLinkError,
  OrderChangeError,
  MinQuantityError,
} from '../../../Errors/orderError'
import PermitError from '../../../Errors/permitError'
import AuthError from '../../../Errors/authError'
import {
  FindProductError,
  UpdateProductError,
  QuantityExceedError,
  ProductCheckError,
} from '../../../Errors/productError'
import { UserFindError } from '../../../Errors/permitAddressError'
import {
  CheckAddressError,
  CheckUserAddressError,
} from '../../../Errors/addressError'

const addOrderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthError()
  }
  try {
    // Check if user is Authorized to perform this operation
    if (!user.isAuthorizedTo(ADD_ORDER)) {
      throw new PermitError()
    }
    // Make sure products were provided.
    if (!args.products || !args.products.length || args.products.length === 0) {
      throw new MinQuantityError()
    }

    // Fetch the products from the database.
    const productIDs = args.products.map(product => product.product)
    const dbProducts = await Product.find(
      { _id: { $in: productIDs } },
      'actualPrice discount tax size'
    )

    // Check whether each product was found in the database or not.
    if (!dbProducts || dbProducts.length !== productIDs.length) {
      throw new ProductCheckError()
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
        throw new QuantityExceedError()
      }
    })

    // Check if the address is valid or not.
    const address = await Address.findById(args.shippingAddress)
    if (!address) {
      throw new CheckAddressError()
    }

    // Check whether the address is contained in the user's list of addresses.
    const addressInUserAddresses = user.address.find(
      userAddress => userAddress.toString() === address._id.toString()
    )
    if (!addressInUserAddresses) {
      throw new CheckUserAddressError()
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
          throw new AddOrderError()
        }
        pro.size[index].quantityAvailable -= product.quantity

        // Reflect the change in quantity to the database.
        const updatedProduct = await Product.findByIdAndUpdate(
          pro._id,
          {
            size: pro.size,
          },
          { new: true, runValidators: true }
        )
        if (!updatedProduct) {
          throw new UpdateProductError()
        }
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
    const order = await new Order({
      products: orderedProducts,
      status: 'Processing',
      payment: {
        status: 'Paid',
        mode: 'E-wallet',
        transactionID: Math.floor(Math.random() * 1000000 + 1).toString(),
      },
      shippingAddress: address._id,
      orderedAt: Date.now(),
    }).save()
    if (!order) {
      throw new SaveOrderError()
    }

    // Also, add the order to the user's list of orders.
    user.order.push(order._id)
    await user.save()
    if (!user) {
      throw new SaveOrderError()
    }

    return order
  } catch (err) {
    throw err
  }
}

const cancelOrderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(CANCEL_ORDER)) {
      throw new PermitError()
    }
    // Find the order and check that its status is 'Processing'.
    const order = await Order.findById(args.id)
    if (!order) {
      throw new CheckOrderError()
    }
    if (order.status !== 'Processing') {
      throw new CancelOrderError()
    }

    // Check to see if the order is in the user's list of orders.
    const orderIndex = user.order.findIndex(
      userOrder => userOrder.toString() === args.id.toString()
    )
    if (orderIndex === -1) {
      throw new OrderLinkError()
    }

    // Update the products in the database to reflect the increase in quantity.
    await Promise.all(
      order.products.map(async product => {
        // For each product in the order, find the corresponding product in the database.
        const pro = await Product.findById(product.product)
        if (!pro) {
          throw new FindProductError()
        }

        // Find the corresponding size of the product, and increase the quantity.
        const index = pro.size.findIndex(size => size.label === product.size)
        if (index === -1) {
          throw new CancelOrderError()
        }
        pro.size[index].quantityAvailable += product.quantity

        // Reflect the change in quantity to the database.
        const updatedProduct = await Product.findByIdAndUpdate(
          product.product,
          {
            size: pro.size,
          },
          { new: true, runValidators: true }
        )
        if (!updatedProduct) {
          throw new UpdateProductError()
        }
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
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(REMOVE_PRODUCT_FROM_ORDER)) {
      throw new PermitError()
    }
    // Find the order and check that its status is 'Processing'.
    const order = await Order.findById(args.id)
    if (!order) {
      throw new CheckOrderError()
    }
    if (order.status !== 'Processing') {
      throw new ChangeOrderError()
    }

    // Check to see if the order is in the user's list of orders.
    const orderInUserOrders = user.order.find(
      userOrder => userOrder.toString() === order._id.toString()
    )
    if (!orderInUserOrders) {
      throw new OrderLinkError()
    }

    // Check that the product ID is valid.
    const product = await Product.findById(args.product)
    if (!product) {
      throw new ProductCheckError()
    }

    // Check that the order contains the provided product ID.
    const productIndex = order.products.findIndex(
      pro => pro.product.toString() === args.product.toString()
    )
    if (productIndex === -1) {
      throw new CheckProductInOrderError()
    }

    // Find the corresponding size for the product, and increase the quantity.
    const sizeIndex = product.size.findIndex(
      size => size.label === order.products[productIndex].size
    )
    if (sizeIndex === -1) {
      throw new RemoveProductError()
    }
    product.size[sizeIndex].quantityAvailable +=
      order.products[productIndex].quantity

    // Reflect the increase in product quantity to the database.
    const updatedProduct = await Product.findByIdAndUpdate(
      args.product,
      {
        size: product.size,
      },
      { new: true, runValidators: true }
    )
    if (!updatedProduct) {
      throw new UpdateProductError()
    }

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
    throw new AuthError()
  }

  try {
    if (!user.isAuthorizedTo(CHANGE_ORDER_STATUS)) {
      throw new PermitError()
    }
    const { id, status } = args
    if (!status || typeof status !== 'string') {
      throw new CheckStatusError()
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
