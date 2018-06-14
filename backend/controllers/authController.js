import { loggedIn } from './utils'
import passport from '../passport'

const authenticateGoogle = () => {
  passport.authenticate('google', {
    scope: ['profile'],
  })
}

const authenticateGoogleCallback = () => {
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
}

const getBasicUserInfo = [
  loggedIn,
  (req, res, next) => {
    if (res.locals.isLoggedIn) {
      return res.json({ user: req.user })
    }
    return res.json({ user: null })
  },
]

const logoutUser = (req, res) => {
  if (req.user) {
    req.session.destroy()
    // req.logout()
    req.clearCookie('connect.sid')
    return res.json({ msg: 'logging you out' })
  }
  return res.json({ msg: 'no user to log out' })
}

const authController = {
  getBasicUserInfo,
  authenticateGoogle,
  authenticateGoogleCallback,
  logoutUser,
}

export default authController
