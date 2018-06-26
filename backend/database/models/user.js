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
    maxlength: 25,
    minlength: 2,
    required: true,
  },
  lastName: {
    type: String,
    maxlength: 25,
    minlength: 2,
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
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
})

UserSchema.virtual('name').get(() => `${this.firstName} ${this.lastName}`)

const User = mongoose.model('User', UserSchema)
export default User
