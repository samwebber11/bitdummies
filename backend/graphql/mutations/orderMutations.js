import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql'

import OrderType from '../types/OrderType'
import ProductOrderedInputType from '../types/ProductOrderedInputType'

import {
  addOrderResolver,
  cancelOrderResolver,
} from '../resolvers/orderResolvers'
import {
  removeProductsFromOrder,
  changeOrderStatus,
} from './updateOrderMutations'

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
  resolve: addOrderResolver,
}

const cancelOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: cancelOrderResolver,
}

const updateOrder = { removeProductsFromOrder, changeOrderStatus }
export { addOrder, cancelOrder, updateOrder }
