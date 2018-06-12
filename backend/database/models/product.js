import mongoose from 'mongoose'

const { Schema } = mongoose

const ProductSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ['action figure', 'none'],
    default: 'none',
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    required: true,
  },
  image: [
    {
      path: {
        type: String,
        required: true,
      },
    },
  ],
  delicacy: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'high',
  },
  name: {
    type: String,
    required: true,
  },
})

const Product = mongoose.model('Product', ProductSchema)
export default Product
