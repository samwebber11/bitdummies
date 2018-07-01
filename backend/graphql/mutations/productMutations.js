import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
} from 'graphql'

import Product from '../../database/models/product'
import ProductType from '../types/ProductType'
import SizeInputType from '../types/SizeInputType'

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
      type: new GraphQLNonNull(new GraphQLList(SizeInputType)),
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
  resolve: async (parent, args) => {
    // this code will be required when we will assign any admin to the whole system and that will be
    // authenticated and when he/she will be logged in this should work.
    // if(user.context)
    // {
    //   const userId = user.context._id
    // }
    try {
      const product = new Product(args)
      if (product.size.quantityAvailable !== 0 && product.imagePath !== null) {
        product = await product.save()
      }
      return product
    } catch (err) {
      console.log('Error occurred in adding product: ', err)
      throw err
    }
  },
}

const removeProduct = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (parent, args) => {
    try {
      const removedProduct = await Product.findByIdAndRemove(args.id)
      return removedProduct
    } catch (err) {
      console.log('Error occurred in removing product: ', err)
      throw err
    }
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
      type: new GraphQLNonNull(new GraphQLList(SizeInputType)),
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
  resolve: async (parent, args) => {
    try {
      const product = await Product.findByIdAndUpdate(
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
      )
      return product
    } catch (err) {
      console.log('Error occurred in updating product: ', err)
      throw err
    }
  },
}

export { addProduct, removeProduct, updateProduct }
