import passport from 'passport'

import GoogleStrategy from './GoogleStrategy'
import User from '../database/models/user'

passport.serializeUser((user, done) => {
  console.log('*** serializeUser called ***')
  // console.log(user)
  console.log('---------------')
  done(null, { _id: user._id })
})

passport.deserializeUser((id, done) => {
  console.log('*** deserializeUser called ***')
  User.findOne({ _id: id }, 'firstName lastName')
    .then(user => {
      console.log('======= USER FOUND =======')
      console.log(user)
      console.log('======= END =======')
      done(null, user)
    })
    .catch(err => {
      console.log('Error in findOne in deserializeUser: ', err)
      done(null, false)
    })
})

// Register strategy.
passport.use(GoogleStrategy)

export default passport
