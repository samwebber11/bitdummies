import mongoose from 'mongoose'
import { isEmail, isMobilePhone } from 'validator'

import permissions from '../permissions'

const { Schema } = mongoose

const addressLimit = arr => arr.length <= 5
const checkMobilePhone = phone => isMobilePhone(phone.toString(), 'any')
const checkRoles = roles => roles.length > 0

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
  roles: {
    type: [
      {
        type: String,
        enum: ['admin', 'user'],
        required: true,
        default: 'user',
      },
    ],
    required: true,
    validate: [checkRoles, 'Must provide a role'],
    default: ['user'],
  },
})

UserSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`
})

UserSchema.methods.isAuthorizedTo = function(operation) {
  if (typeof operation !== 'string') {
    throw new Error('Expected parameter operation as a string')
  }

  let isAllowed = false
  this.roles.forEach(role => {
    if (permissions[role].includes(operation)) {
      isAllowed = true
    }
  })

  return isAllowed
}

const skipInit = process.env.NODE_ENV === 'test'

const User = mongoose.model('User', UserSchema, 'users', skipInit)
export default User
