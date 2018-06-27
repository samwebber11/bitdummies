import mongoose from 'mongoose'

const { Schema } = mongoose

const ProductSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ['Action Figures', 'T-Shirts', 'None'],
    default: 'None',
  },
  size: [
    {
      label: {
        type: String,
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'Onesize'],
        default: 'Onesize',
      },
      quantityAvailable: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 200,
    default:
      'A very little short description of the searched product is available.',
  },
  actualPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    max: 50,
    min: 0,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
    enum: [5, 10, 12.5, 18, 23.5, 28],
    default: 5,
  },
  imagePath: [
    {
      type: String,
      required: true,
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

ProductSchema.virtual('discountedPrice').get(function() {
  return this.actualPrice - (this.actualPrice * this.discount) / 100
})

const Product = mongoose.model('Product', ProductSchema)
export default Product
