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
      if (!newUser) {
        console.log('Error! Saving the new Google user: ', err)
        return done(null, false)
      }
      return done(null, newUser)
    } catch (err) {
      throw new Error('Error fetching details from google: ', err)
    }
  }
)

export default GoogleStrategy

//     const currentUser = async(() =>
//   {
//     User.findOne({provider: {
//       name: 'google',id
//     }
//   }
// )
//   })
//     process.nextTick(()=>
//   {
//     User.findOne({
//       provider: {
//         name: 'google',
//         id,
//       },
//     })
//       .then(currentUser => {
//         // If a user already exists.
//         if (currentUser) {
//           done(null, currentUser)
//         } else {
//           const user = new User({
//             provider: {
//               name: 'google',
//               id,
//             },
//             email,
//             firstName: givenName,
//             lastName: familyName,
//           })

//          await user
//             .save()
//             .then(newUser => {
//               done(null, newUser)
//             })
//             .catch(err => {
//               console.log('Error! Saving the new Google user: ', err)
//               return done(null, false)
//             })
//         }
//       })
//       .catch(err => {
//         console.log(
//           'Error! Trying to find user with provider "google" and its ID: ',
//           err
//         )
//         return done(null, false)
//       })
//   }
// )


