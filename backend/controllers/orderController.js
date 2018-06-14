import { loggedIn, merge } from './utils'
import Order from '../database/models/order'

const getOrderInfo = [
  loggedIn,
  (req, res, next) => {
    if (!req.locals.isLoggedIn) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    console.log('==== req.params ====')
    console.log(req.params)
    console.log('==== end ====')

    Order.findById(req.params.id)
      .sort([['orderedAt', 'descending']])
      .populate('product.productID')
      .populate('shippingAddress')
      .exec((err, order) => {
        if (err) return next(err)

        if (!order) {
          const error = new Error('Order not found')
          error.status = 404
          return next(error)
        }

        return res.json({ order })
      })
  },
]

const getOrdersList = [
  loggedIn,
  (req, res, next) => {
    if (!req.locals.isLoggedIn) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    console.log('==== req.params ====')
    console.log(req.params)
    console.log('==== end ====')
    console.log('==== req.query ====')
    console.log(req.query)
    console.log('==== end ====')

    const query = merge(req.query)
    Order.find(query)
      .sort([['orderedAt', 'descending']])
      .populate('product.productID')
      .populate('shippingAddress')
      .exec((err, ordersList) => {
        if (err) return next(err)

        if (ordersList.length === 0) {
          const error = new Error('No orders in database match the given query')
          error.status = 400
          return next(error)
        }

        return res.json({ ordersList })
      })
  },
]

const orderController = {
  getOrderInfo,
  getOrdersList,
}

export default orderController
