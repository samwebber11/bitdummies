import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql'
import GraphQLDate from 'graphql-date'

import Product from '../../database/models/product'
import Address from '../../database/models/address'
import ProductType from './ProductType'
import PaymentType from './PaymentType'
import AddressType from './AddressType'

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    products: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            new GraphQLObjectType({
              name: 'ProductBought',
              fields: () => ({
                product: {
                  type: ProductType,
                  resolve: async (parent, args) => {
                    try {
                      const product = await Product.findById(
                        parent.product,
                        'name category description imagePath delicacy'
                      )
                      return product
                    } catch (err) {
                      console.log(
                        'Error in fetching product details in order: ',
                        err
                      )
                    }
                  },
                },
                size: {
                  type: new GraphQLNonNull(GraphQLString),
                },
                quantity: {
                  type: new GraphQLNonNull(GraphQLInt),
                },
                actualPrice: {
                  type: new GraphQLNonNull(GraphQLFloat),
                },
                discount: {
                  type: new GraphQLNonNull(GraphQLInt),
                },
                discountedPrice: {
                  type: new GraphQLNonNull(GraphQLFloat),
                },
                tax: {
                  type: new GraphQLNonNull(GraphQLFloat),
                },
              }),
            })
          )
        )
      ),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payment: {
      type: new GraphQLNonNull(PaymentType),
    },
    shippingAddress: {
      type: new GraphQLNonNull(AddressType),
      resolve: async (parent, args) => {
        try {
          const address = await Address.findById(parent.shippingAddress)
          return address
        } catch (err) {
          console.log('Error in fetching address for order: ', err)
        }
      },
    },
    orderedAt: {
      type: new GraphQLNonNull(GraphQLDate),
    },
  }),
})

export default OrderType
