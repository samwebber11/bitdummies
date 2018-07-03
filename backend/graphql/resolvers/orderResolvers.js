import Order from '../../database/models/order'
import Product from '../../database/models/product'
import Address from '../../database/models/address'
import User from '../../database/models/user'

const addOrderResolver = async (parent, args, context) => {
  // TODO: Do some user checking/authorization over here.
  if (context.user) {
    const userId = context.user._id
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('No User Found')
    }
    try {
      const productIDs = []
      args.products.forEach(product => productIDs.push(product.product))

      // const productIDs = args.products.map(product => product.product)
      const dbProducts = await Product.find(
        { _id: { $in: productIDs } },
        'actualPrice discount tax size'
      )

      if (dbProducts.length !== productIDs.length) {
        throw new Error('Products not in database')
      }
      args.products.forEach(product => {
        const pro = dbProducts.find(prod => prod._id === product.product)
        const proSize = pro.size.find(size => size.label === product.size)
        if (proSize.quantityAvailable < product.quantity) {
          throw new Error('Quantity Limit Exceeded')
        }
      })
      // checking if the address is associated with that user or not.
      const savedAddress = await Address.findById(args.shippingAddress)
      if (!savedAddress) {
        throw new Error('Invalid Address')
      }
      let checkAddress = false
      user.address.forEach(address => {
        if (savedAddress.toString() === address.address.toString()) {
          checkAddress = true
        }
      })
      if (!checkAddress) {
        throw new Error('Address is not associated with User')
      }

      // args.products.forEach(product => {
      //   const dbProduct = dbProducts.find(pro => pro._id === product.product)
      //   // console.log(dbProduct)
      //   const dbProductSize = dbProduct.size.find(
      //     size => size.label === product.size
      //   )
      //   console.log(dbProductSize)
      //   if (product.quantity > dbProductSize.quantity) {
      //     throw new Error('Quantity limit exceeded')
      //   }
      // })

      // Reaching here means that all products are available.
      // const address = await Address.findById(args.shippingAddress)
      // if (!address) {
      //   throw new Error('Invalid address')
      // }

      // TODO: Check here if the address is in the list of user's addresses.Done.
      // TODO: Also check for payment here.
      const products = args.products.forEach(product => {
        const { actualPrice, tax, discount, discountedPrice } = dbProducts.find(
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

      let order = new Order({
        products,
        status: 'Processing',
        payment: {
          status: 'Paid',
          mode: 'E-wallet',
        },
        shippingAddress: args.shippingAddress,
        orderedAt: Date.now(),
      })

      order = await order.save()
      if (!order) {
        throw new Error('Could not save order')
      }

      user.order.push(order._id)
      await user.save()
      if (!user) {
        throw new Error('Error occured in saving order')
      }
      // Pushing the order in the list of orders for a particular user

      // Update the products to reflect the decrease in quantity.
      args.products.forEach(async product => {
        const pro = dbProducts.find(
          prod => prod._id.toString() === product.product.toString()
        )
        const index = pro.size.findIndex(
          size => size.label.toString() === product.size.label.toString()
        )

        if (index === -1) {
          throw new Error('Some error occurred in addOrder')
        }
        pro.size[index].quantityAvailable -= product.quantity

        const updatedProduct = await Product.findByIdAndUpdate(
          product.product,
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
      })
    } catch (err) {
      throw err
    }
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
