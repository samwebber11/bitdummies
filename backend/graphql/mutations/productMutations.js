import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql'

import Product from '../../database/models/product'
import ProductType from '../types/ProductType'

const addProduct = {
  type: ProductType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    category: {
      type: new GraphQLNonNull(GraphQLString),
    },
    size: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLInputObjectType({
            name: 'sizeInput',
            fields: {
              label: {
                type: GraphQLString,
              },
              quantityAvailable: {
                type: GraphQLInt,
              },
            },
          })
        )
      ),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    actualPrice: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    tax: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    imagePath: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    delicacy: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (parent, args) => {
    const product = new Product(args)
    const savedProduct = product.save()
    if (!savedProduct) {
      throw new Error('Error')
    }
    return savedProduct
  },
}

const removeProduct = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (parent, args) => {
    const removedProduct = Product.findByIdAndRemove(args.id).exec()
    if (!removedProduct) {
      throw new Error('Error')
    }
    return removedProduct
  },
}

const updateProduct = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    category: {
      type: new GraphQLNonNull(GraphQLString),
    },
    size: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLInputObjectType({
            name: 'sizeInputUpdate',
            fields: {
              label: {
                type: GraphQLString,
              },
              quantityAvailable: {
                type: GraphQLInt,
              },
            },
          })
        )
      ),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    actualPrice: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    tax: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    imagePath: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    delicacy: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (parent, args) =>
    Product.findByIdAndUpdate(
      args.id,
      {
        $set: {
          name: args.name,
          category: args.category,
          size: args.size,
          description: args.description,
          actualPrice: args.actualPrice,
          discount: args.discount,
          tax: args.tax,
          imagePath: args.imagePath,
          delicacy: args.delicacy,
        },
      },
      { new: true }
    ).catch(err => new Error(err)),
}

export { addProduct, removeProduct, updateProduct }
