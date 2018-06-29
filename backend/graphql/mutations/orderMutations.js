import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } from 'graphql'

import Order from '../../database/models/order'
import Product from '../../database/models/product'
import Address from '../../database/models/address'
import OrderType from '../types/OrderType'
import ProductOrderedInputType from '../types/ProductOrderedInputType'
import PaymentInputType from '../types/PaymentInputType'

const addOrder = {
  type: OrderType,
  args: {
    products: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProductOrderedInputType))
      ),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    // TODO: Do some user checking/authorization over here.
    try {
      const productIDs = args.products.map(product => product.product)
      const dbProducts = await Product.find(
        { _id: { $in: productIDs } },
        'actualPrice discount tax size'
      )

      if (dbProducts.length !== productIDs.length) {
        throw new Error('Products not in database')
      }

      args.products.forEach(product => {
        const dbProduct = dbProducts.find(pro => pro._id === product.product)
        console.log(dbProduct)
        const dbProductSize = dbProduct.size.find(
          size => size.label === product.size
        )
        console.log(dbProductSize)
        if (product.quantity > dbProductSize.quantity) {
          throw new Error('Quantity limit exceeded')
        }
      })

      // Reaching here means that all products are available.
      const address = await Address.findById(args.shippingAddress)
      if (!address) {
        throw new Error('Invalid address')
      }

      // TODO: Check here if the address is in the list of user's addresses.
      // TODO: Also check for payment here.
      const products = args.products.map(product => {
        const { actualPrice, tax, discount, discountedPrice } = dbProducts.find(
          pro => pro._id === product.product
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
          transactionID: (Math.random() * 1000000 + 1).toString(),
        },
        shippingAddress: args.shippingAddress,
        orderedAt: Date.now(),
      })

      order = await order.save()
      if (!order) {
        throw new Error('Could not save order')
      }

      // Update the products to reflect the decrease in quantity.
      args.products.forEach(async product => {
        const dbProduct = dbProducts.find(pro => pro._id === product.product)
        const index = dbProduct.size.findIndex(
          size => size.label === product.size
        )

        if (index === -1) {
          throw new Error('Some error occurred in addOrder')
        }
        dbProduct.size[index].quantity -= product.quantity

        const updatedProduct = await Product.findByIdAndUpdate(
          product.product,
          {
            size: dbProduct.size,
          },
          { new: true }
        )
        if (!updatedProduct) {
          throw new Error('Could not update product')
        }
      })
    } catch (err) {
      throw err
    }
  },
}

const cancelOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const cancelledOrder = await Order.findByIdAndRemove(args.id)
      return cancelledOrder
    } catch (err) {
      console.log('Error occurred in cancelling order: ', err)
      throw err
    }
  },
}

const updateOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    products: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProductOrderedInputType))
      ),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(PaymentInputType),
    },
    shippingAddress: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const order = await Order.findByIdAndUpdate(args.id, args, { new: true })
      return order
    } catch (err) {
      console.log('Error occurred in updating order: ', err)
      throw err
    }
  },
}

export { addOrder, cancelOrder, updateOrder }
