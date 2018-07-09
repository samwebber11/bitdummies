import Order from '../../../database/models/order'
import { QUERY_ORDERS, QUERY_ORDER } from '../../../database/operations'
import AuthenticationError from '../../../errors/AuthenticationError'
import AuthorizationError from '../../../errors/AuthorizationError'

const ordersResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    if (!user.isAuthorizedTo(QUERY_ORDERS)) {
      throw new AuthorizationError()
    }
    const ordersList = await Order.find(args.filters).sort(args.orderBy)
    return ordersList
  } catch (err) {
    throw err
  }
}

const orderResolver = async (parent, args, context) => {
  const { user } = context
  if (!user) {
    throw new AuthenticationError()
  }
  try {
    if (!user.isAuthorizedTo(QUERY_ORDER)) {
      throw new AuthorizationError()
    }
    const orderPlaced = await Order.findById(args.id)
    return orderPlaced
  } catch (err) {
    throw err
  }
}

export { ordersResolver, orderResolver }
