import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
} from 'graphql'

import ProductType from '../types/ProductType'
import SizeInputType from '../types/SizeInputType'
import {
  addProductResolver,
  removeProductResolver,
  updateProductInfoResolver,
  updateProductImagesResolver,
  updateProductQuantityResolver,
} from '../resolvers/productResolvers'

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
        new GraphQLList(new GraphQLNonNull(SizeInputType))
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
  resolve: addProductResolver,
}

const removeProduct = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: removeProductResolver,
}

const updateProductInfo = {
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
    delicacy: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: updateProductInfoResolver,
}

const updateProductImages = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    imagePath: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
  },
  resolve: updateProductImagesResolver,
}

const updateProductQuantity = {
  type: ProductType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    size: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(SizeInputType))
      ),
    },
  },
  resolve: updateProductQuantityResolver,
}

export {
  addProduct,
  removeProduct,
  updateProductInfo,
  updateProductImages,
  updateProductQuantity,
}
