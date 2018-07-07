import mongoose from 'mongoose'
import float from 'mongoose-float'

const { Schema } = mongoose

const validateImages = imagePath =>
  imagePath.length > 0 && imagePath.length <= 5
const sizeLength = size => size.length > 0
const uniqueSize = size => {
  const countLabels = {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    Onesize: 0,
  }

  size.forEach(currentSize => {
    countLabels[currentSize.label] += 1
  })

  let invalidSize = false
  Object.entries(countLabels).forEach(label => {
    if (label[1] > 1) {
      invalidSize = true
    }
  })

  if (invalidSize) {
    return false
  }

  return true
}

const validateSize = [
  { validator: sizeLength, msg: 'Must have at least one valid size' },
  { validator: uniqueSize, msg: 'Size labels must be unique' },
]

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
    validate: validateSize,
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

const skipInit = process.env.NODE_ENV === 'test'

const Product = mongoose.model('Product', ProductSchema, 'products', skipInit)
export default Product
