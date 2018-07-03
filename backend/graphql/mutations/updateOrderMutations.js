import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'

import Order from '../../database/models/order'
import Product from '../../database/models/product'
import OrderType from '../types/OrderType'
import User from '../../database/models/user'

const removeProductsFromOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    product: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  // shippingAddress: new GraphQLNonNull(GraphQLID)
  resolve: async (parent, args, context) => {
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
  },
}

const changeOrderStatus = {
  type: OrderType,
  args: {
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (args, parent, context) => {
    if (context.user) {
      const userId = context.user._id
      const user = User.find(userId)
      if (!user) {
        throw new Error('User does not exists')
      }
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
  },
}

export { removeProductsFromOrder, changeOrderStatus }
