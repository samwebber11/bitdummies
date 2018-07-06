import { Strategy } from 'passport-facebook'

import keys from '../config/keys'
import User from '../database/models/user'

const FacebookStrategy = new Strategy(
  {
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, name, emails } = profile
    const { givenName, familyName } = name
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
      if (!newUser) {
        console.log('Error saving details')
        return done(null, false)
      }
      return done(null, newUser)
    } catch (err) {
      console.log('Error fetching details from Facebook: ', err)
      return done(null, err)
    }
  }
)
export default FacebookStrategy
//   (accessToken, refreshToken, profile, done) => {
//     const { id, name, emails } = profile
//     const { givenName } = name
//     const email = emails[0].value
//     User.findOne({
//       provider: {
//         name: 'facebook',
//         id,
//       },
//     })
//       .then(currentUser => {
//         if (currentUser) {
//           done(null, currentUser)
//         } else {
//           const newUser = new User({
//            \
//           })

//           newUser
//             .save()
//             .then(user => {
//               done(null, user)
//             })
//             .catch(err => {
//               console.log('Error! Cannot Save Facebook User ', err)
//               return done(null, false)
//             })
//         }
//       })
//       .catch(err => {
//         console.log('Error Finding the user ', err)
//         return done(null, false)
//       })
//   }
// )


