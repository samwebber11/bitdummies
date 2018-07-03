import Order from '../../database/models/order'
import Product from '../../database/models/product'
import Address from '../../database/models/address'
import User from '../../database/models/user'

const addOrderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new Error('Must be logged in')
  }

  try {
    // Make sure products were provided.
    if (!args.products || !args.products.length || args.products.length === 0) {
      throw new Error('Must have at least one product')
    }

    // Fetch the products from the database.
    const productIDs = args.products.map(product => product.product)
    const dbProducts = await Product.find(
      { _id: { $in: productIDs } },
      'actualPrice discount tax size'
    )

    // Check whether each product was found in the database or not.
    if (!dbProducts || dbProducts.length !== productIDs.length) {
      throw new Error('Products not in database')
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
        throw new Error('Quantity limit exceeded')
      }
    })

    // Check if the address is valid or not.
    const address = await Address.findById(args.shippingAddress)
    if (!address) {
      throw new Error('Invalid address')
    }

    // Check whether the address is contained in the user's list of addresses.
    const addressInUserAddresses = user.address.includes(address._id.toString())
    if (!addressInUserAddresses) {
      throw new Error('Address is not associated with user')
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
        const index = pro.size.findIndex(
          size => size.label === product.size.label
        )
        if (index === -1) {
          throw new Error('Some error occurred while adding order')
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
          throw new Error('Could not update product')
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
      orderedProducts,
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
      throw new Error('Could not save order')
    }

    // Also, add the order to the user's list of orders.
    user.order.push(order._id)
    await user.save()
    if (!user) {
      throw new Error('Error occured in saving order')
    }

    return order
  } catch (err) {
    throw err
  }
}

const cancelOrderResolver = async (parent, args, context) => {
  if (context.user) {
    const userId = context.user._id
    const user = User.findById(userId)
    if (!user) {
      throw new Error('User not logged in')
    }
    try {
      const newOrder = Order.findById(args.id)
      if (!newOrder) {
        throw new Error('Order is not present')
      }
      if (newOrder.status.toString() !== 'Processing') {
        throw new Error('Cannot cancel order now!')
      }

      newOrder.products.forEach(async product => {
        const pro = Product.findById(product.product)
        const index = pro.size.findIndex(
          size => size.label.toString() === product.size.label.toString()
        )

        if (index === -1) {
          throw new Error('Some error occurred in CancelOrder')
        }
        pro.size[index].quantityAvailable += product.quantity
        const updatedProduct = await Product.findByIdAndUpdate(
          product.product,
          {
            $set: {
              size: pro.size,
            },
          },
          { new: true }
        )
        if (!updatedProduct) {
          throw new Error('Cannot update new Product')
        }
        updatedProduct.save()
      })

      const index = user.order.findIndex(args.id)
      if (index === -1) {
        throw new Error('Order is not present')
      }
      await user.order.splice(index, 1)
      user.save()
      if (!user) {
        throw new Error('Cannot update User List')
      }

      const cancelledOrder = await Order.findByIdAndRemove(args.id)
      return cancelledOrder
    } catch (err) {
      console.log('Error occurred in cancelling order: ', err)
      throw err
    }
  }
}

const removeProductsFromOrderResolver = async (parent, args, context) => {
  if (context.user) {
    const userId = context.user._id
    const user = User.findById(userId)
    try {
      let orderPresent = false
      user.order.forEach(order => {
        if (order.order.toString() === args.id.toString()) {
          orderPresent = true
        }
      })
      if (!orderPresent) {
        throw new Error('No Order is associated')
      }
      const order = Order.find(args.id)
      let productCheck = false
      order.products.forEach(product => {
        if (product.product.toString() === args.product.id.toString()) {
          productCheck = true
        }
      })
      if (!productCheck) {
        throw new Error('Product Not Found')
      }

      //  Updating the size of product
      const pro = Product.find(args.product.id)
      const index = pro.size.findIndex(pro.size.label)

      if (index === -1) {
        throw new Error('Some error occurred in addOrder')
      }
      pro.size[index].quantityAvailable += order.products.product.quantity

      const updatedProduct = await Product.findByIdAndUpdate(
        args.product.id,
        {
          size: pro.size,
        },
        { new: true }
      )
      updatedProduct.save()
      if (!updatedProduct) {
        throw new Error('Could not update product')
      }
      // return updatedProduct

      const index1 = user.order.products.findIndex(args.product.id)
      if (index1 === -1) {
        throw new Error('Order is not present')
      }
      await user.order.products.splice(index1, 1)
      user.save()
      if (!user) {
        throw new Error('Cannot update User List')
      }
      return order
    } catch (err) {
      console.log('Error occurred in updating order: ', err)
      throw err
    }
  }
}

const changeOrderStatusResolver = async (args, parent, context) => {
  if (context.user) {
    const userId = context.user._id
    const user = User.find(userId)
    if (!user) {
      throw new Error('User does not exists')
    }
    let orderPresent = false
    try {
      user.order.forEach(order => {
        if (order.order.toString() === args._id.toString()) {
          orderPresent = true
        }
      })
      if (!orderPresent) {
        throw new Error('No Order is associated')
      }
      Order.findByIdAndUpdate(
        args._id,
        {
          $set: {
            status: args.status,
          },
        },
        { new: true }
      )
    } catch (err) {
      console.log('Error Updating status: ', err)
      throw err
    }
  }
}

export {
  addOrderResolver,
  cancelOrderResolver,
  removeProductsFromOrderResolver,
  changeOrderStatusResolver,
}
