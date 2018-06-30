import passport from 'passport'

import GoogleStrategy from './GoogleStrategy'
import User from '../database/models/user'

passport.serializeUser((user, done) => {
  done(null, { _id: user._id })
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    if (user) {
      done(null, user)
    }
  } catch (err) {
    console.log('Error in findOne in deserializeUser: ', err)
    done(null, false)
  }
})

// Register strategy.
passport.use(GoogleStrategy)

export default passport
