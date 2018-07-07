import { GraphQLObjectType } from 'graphql'

import { addAddress, removeAddress, updateAddress } from './addressMutations'
import {
  addOrder,
  cancelOrder,
  removeProductFromOrder,
  changeOrderStatus,
} from './orderMutations'
import {
  addProduct,
  removeProduct,
  updateProductInfo,
  updateProductImages,
  updateProductQuantity,
} from './productMutations'
import { updateUser, changeUserRole } from './userMutations'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAddress,
    updateAddress,
    removeAddress,
    addOrder,
    cancelOrder,
    removeProductFromOrder,
    changeOrderStatus,
    addProduct,
    removeProduct,
    updateProductInfo,
    updateProductImages,
    updateProductQuantity,
    updateUser,
    changeUserRole,
  },
})

export default Mutation
