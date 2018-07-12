import { Strategy } from 'passport-facebook'

import User from '../database/models/user'

const FacebookStrategy = new Strategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'name', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, name, emails } = profile
    const { familyName, givenName } = name
    const email = emails[0].value
    try {
      const currentUser = await User.findOne({
        provider: {
          name: 'facebook',
          id,
        },
      })
      if (currentUser) {
        return done(null, currentUser)
      }

      const newUser = await User.create({
        provider: {
          name: 'facebook',
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

export default FacebookStrategy
