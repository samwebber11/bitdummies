import { GraphQLObjectType } from 'graphql'

import { addProduct, removeProduct, updateProduct } from './productMutations'
import { addOrder, cancelOrder, updateOrder } from './orderMutations'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProduct,
    removeProduct,
    updateProduct,
    addOrder,
    updateOrder,
    cancelOrder,
  },
})

export default Mutation
