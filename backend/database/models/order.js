import mongoose from 'mongoose'

const { Schema } = mongoose.Schema

const OrderSchema = new Schema({
  products: [
    {
      productID: {
        type: Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
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
    type: Schema.ObjectId,
    ref: 'Address',
    required: true,
  },
})

const Order = mongoose.model('Order', OrderSchema)
export default Order
