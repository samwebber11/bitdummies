import { GraphQLObjectType } from 'graphql'

import { addProduct, removeProduct, updateProduct } from './productMutations'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProduct,
    removeProduct,
    updateProduct,
  },
})

export default Mutation
