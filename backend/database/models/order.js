import mongoose from 'mongoose'

const { Schema } = mongoose

const OrderSchema = new Schema({
  product: [
    {
      productID: {
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
        type: Number,
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
        type: Number,
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
      enum: ['unpaid', 'processing', 'paid', 'failed'],
      default: 'unpaid',
    },
    mode: {
      type: String,
      required: true,
      enum: ['E-wallet', 'Cash on Delivery', 'Credit/Debit card', 'none'],
      default: 'none',
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

// Order Function to get the discount Price
OrderSchema.pre('save', function(next) {
  this.product.forEach(pro => {
    pro.discountedPrice =
      pro.actualPrice - (pro.actualPrice * pro.discount) / 100
  })
  next()
})

const Order = mongoose.model('Order', OrderSchema)
export default Order
