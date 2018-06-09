import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({
  // firstName: { type: String, required: true },
  // lastName: { type: String, required: true },
  // email: { type: String, required: true, unique: true },
  // phone: { type: String, required: true },
  googleID: { type: String, required: true },
  username: { type: String, required: true },
  thumbnail: { type: String },
})

const User = mongoose.model('User', UserSchema)
export default User
