import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString } from 'graphql'

import OrderType from '../types/OrderType'
import ProductOrderedInputType from '../types/ProductOrderedInputType'
import {
  addOrderResolver,
  cancelOrderResolver,
  removeProductFromOrderResolver,
  changeOrderStatusResolver,
} from '../resolvers/mutations/orderResolvers'

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

const removeProductFromOrder = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    product: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: removeProductFromOrderResolver,
}

const changeOrderStatus = {
  type: OrderType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: changeOrderStatusResolver,
}

export { addOrder, cancelOrder, removeProductFromOrder, changeOrderStatus }
