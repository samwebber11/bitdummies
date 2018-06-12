import { OAuth2Strategy } from 'passport-google-oauth'

import keys from '../config/keys'
import User from '../database/models/user'

const GoogleStrategy = new OAuth2Strategy(
  {
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // Testing.
    console.log('============ GOOGLE PROFILE ============')
    console.log(profile)
    console.log('============ END ============')

    const { displayName, id } = profile
    User.findOne({ googleID: id })
      .then(currentUser => {
        // If a user already exists.
        if (currentUser) {
          done(null, currentUser)
        } else {
          // If there is no user in the db with that googleID.
          console.log('====== PRE SAVE =======')
          console.log(displayName)
          console.log(id)
          console.log(profile)
          console.log('====== POST SAVE =======')
          const user = new User({
            username: displayName,
            googleID: id,
            thumbnail: profile._json.image.url,
          })

          user
            .save()
            .then(newUser => {
              done(null, newUser)
            })
            .catch(err => {
              console.log('Error! Saving the new Google user: ', err)
              return done(null, false)
            })
        }
      })
      .catch(err => {
        console.log('Error! Trying to find user with googleID: ', err)
        return done(null, false)
      })
  }
)

export default GoogleStrategy
