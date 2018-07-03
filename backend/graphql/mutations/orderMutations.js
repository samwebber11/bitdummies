import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString } from 'graphql'

import OrderType from '../types/OrderType'
import ProductOrderedInputType from '../types/ProductOrderedInputType'
import {
  addOrderResolver,
  cancelOrderResolver,
  removeProductsFromOrderResolver,
  changeOrderStatusResolver,
} from '../resolvers/orderResolvers'

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
  resolve: removeProductsFromOrderResolver,
}

const changeOrderStatus = {
  type: OrderType,
  args: {
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: changeOrderStatusResolver,
}

export { addOrder, cancelOrder, removeProductsFromOrder, changeOrderStatus }
