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
    // console.log('============ GOOGLE PROFILE ============')
    // console.log(profile)
    // console.log('============ END ============')

    const { id, name, emails } = profile
    const { familyName, givenName } = name
    const email = emails[0].value
    User.findOne({
      provider: {
        name: 'google',
        id,
      },
    })
      .then(currentUser => {
        // If a user already exists.
        if (currentUser) {
          done(null, currentUser)
        } else {
          // If there is no user in the db with that googleID.
          // console.log('====== PRE SAVE =======')
          // console.log(givenName, familyName)
          // console.log(id)
          // console.log(profile)
          // console.log('====== POST SAVE =======')
          const user = new User({
            provider: {
              name: 'google',
              id,
            },
            email,
            firstName: givenName,
            lastName: familyName,
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
        console.log(
          'Error! Trying to find user with provider "google" and its ID: ',
          err
        )
        return done(null, false)
      })
  }
)

export default GoogleStrategy
