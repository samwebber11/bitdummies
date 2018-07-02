import mongoose, { ValidationError } from 'mongoose'
import float from 'mongoose-float'

const { Schema } = mongoose

const validateImages = imagePath =>
  imagePath.length > 0 && imagePath.length <= 5
const validateSizes = size => size.length > 0

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Action Figures', 'T-Shirts', 'Shoes', 'Gloves', 'Hat', 'None'],
    default: 'None',
  },
  size: {
    type: [
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
    validate: [validateSizes, 'Must have at least one valid size'],
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 200,
    default:
      'A very little short description of the searched product is available.',
  },
  actualPrice: {
    type: float.loadType(mongoose, 2),
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    max: 50,
    min: 0,
    default: 0,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
    enum: [5, 10, 12.5, 18, 23.5, 28],
    default: 5,
  },
  imagePath: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    validate: [validateImages, 'Must have at least 1 and at max 5 images'],
  },
  delicacy: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'high',
  },
})

ProductSchema.virtual('discountedPrice').get(function() {
  const discountedPrice =
    this.actualPrice - (this.actualPrice * this.discount) / 100
  return discountedPrice.toFixed(2)
})

ProductSchema.pre('findOneAndUpdate', function(next) {
  const { size, imagePath } = this.getUpdate()

  if (size) {
    if (!validateSizes(size)) {
      throw new ValidationError('Must have at least one valid size')
    }
  }

  if (imagePath) {
    if (!validateImages(imagePath)) {
      throw new ValidationError('Must have at least 1 and at max 5 images')
    }
  }

  next()
})

const skipInit = process.env.NODE_ENV === 'test'

const Product = mongoose.model('Product', ProductSchema, 'products', skipInit)
export default Product
