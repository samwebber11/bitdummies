import float from 'mongoose-float'
import mongoose from 'mongoose'

const { Schema } = mongoose

const OrderSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      actualPrice: {
        type: float.loadType(mongoose, 2),
        required: true,
        min: 0,
      },
      tax: {
        type: Number,
        required: true,
        enum: [5, 10, 12.5, 18, 23.5, 28],
        default: 5,
      },
      discount: {
        type: Number,
        max: 50,
        min: 0,
        required: true,
      },
      discountedPrice: {
        type: float.loadType(mongoose, 2),
        min: 0,
        required: true,
      },
      size: {
        type: String,
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'Onesize'],
        default: 'Onesize',
      },
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Dispatched', 'On its way', 'Delivered'],
    default: 'Processing',
  },
  payment: {
    status: {
      type: String,
      required: true,
      enum: ['Unpaid', 'Processing', 'Paid', 'Failed'],
      default: 'Unpaid',
    },
    mode: {
      type: String,
      required: true,
      enum: ['E-wallet', 'Cash on Delivery', 'Credit/Debit card', 'None'],
      default: 'None',
    },
    transactionID: {
      type: String,
    },
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  orderedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})

// Order function to get the discounted price.
OrderSchema.pre('save', function(next) {
  this.products.forEach(product => {
    product.discountedPrice =
      product.actualPrice - (product.actualPrice * product.discount) / 100
  })
  next()
})

const skipInit = process.env.NODE_ENV === 'test'

const Order = mongoose.model('Order', OrderSchema, 'orders', skipInit)
export default Order
