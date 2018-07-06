import { OAuth2Strategy } from 'passport-google-oauth'

import keys from '../config/keys'
import User from '../database/models/user'

const GoogleStrategy = new OAuth2Strategy(
  {
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, name, emails } = profile
    const { familyName, givenName } = name
    const email = emails[0].value
    try {
      const currentUser = await User.findOne({
        provider: {
          name: 'google',
          id,
        },
      })
      if (currentUser) {
        return done(null, currentUser)
      }

      const newUser = await User.create({
        provider: {
          name: 'google',
          id,
        },
        email,
        firstName: givenName,
        lastName: familyName,
      })

      return done(null, newUser)
    } catch (err) {
      console.log(err)
      return done(null, false)
    }
  }
)

export default GoogleStrategy
