import mongoose from 'mongoose'
import { isPostalCode } from 'validator'

const { Schema } = mongoose

const validateZipCode = zip => isPostalCode(zip, 'any')

const AddressSchema = new Schema({
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
    validate: {
      validator: validateZipCode,
      message: 'Invalid zip code',
    },
  },
  country: {
    type: String,
    required: true,
  },
})

const Address = mongoose.model('Address', AddressSchema)
export default Address
