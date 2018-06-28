import { GraphQLObjectType } from 'graphql'

import { addProduct, removeProduct, updateProduct } from './productMutations'
import { addOrder, cancelOrder, updateOrder } from './orderMutations'
import { addAddress, updateAddress, removeAddress } from './addressMutations'

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
  },
})

export default Mutation
