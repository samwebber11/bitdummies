import mongoose from 'mongoose'
import { isEmail, isMobilePhone } from 'validator'

const { Schema } = mongoose

const UserSchema = new Schema({
  provider: {
    name: {
      type: String,
      required: true,
      enum: ['google', 'facebook', 'self'],
      default: 'self',
    },
    id: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Invalid email'],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    validate: [isMobilePhone, 'Invalid phone'],
  },
  address: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
  ],
})

const User = mongoose.model('User', UserSchema)
export default User
