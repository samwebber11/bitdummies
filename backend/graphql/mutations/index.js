import { GraphQLObjectType } from 'graphql'

import { addProduct, removeProduct, updateProduct } from './productMutations'
import { addOrder, cancelOrder, updateOrder } from './orderMutations'
import { addAddress, removeAddress, updateAddress } from './addressMutations'
import { addUser, removeUser, updateUser } from './userMutations'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProduct,
    removeProduct,
    updateProduct,
    addOrder,
    updateOrder,
    cancelOrder,
    addAddress,
    updateAddress,
    removeAddress,
    addUser,
    removeUser,
    updateUser,
  },
})

export default Mutation
