import mongoose, { ValidationError } from 'mongoose'
import { isEmail, isMobilePhone } from 'validator'

const { Schema } = mongoose

const addressLimit = arr => arr.length <= 5
const checkMobilePhone = phone => isMobilePhone(phone.toString(), 'any')

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
    validate: [checkMobilePhone, 'Invalid phone'],
  },
  address: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    validate: [addressLimit, 'Cannot have more than 5 addresses'],
  },
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
})

UserSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`
})

UserSchema.pre('findOneAndUpdate', function(next) {
  const { phone, email } = this.getUpdate()
  if (phone) {
    if (!checkMobilePhone(phone)) {
      throw new ValidationError('Invalid phone')
    }
  }

  if (email) {
    if (!isEmail(email.toString())) {
      throw new ValidationError('Invalid email')
    }
  }

  next()
})

const skipInit = process.env.NODE_ENV === 'test'

const User = mongoose.model('User', UserSchema, 'users', skipInit)
export default User
