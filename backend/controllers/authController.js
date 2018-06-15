import { loggedIn } from './utils'

const getBasicUserInfo = [
  loggedIn,
  (req, res, next) => {
    if (res.locals.isLoggedIn) {
      return res.json({ user: req.user })
    }
    return res.json({ user: null })
  },
]

const logoutUser = [
  loggedIn,
  (req, res) => {
    if (res.locals.isLoggedIn) {
      req.session.destroy()
      // req.logout()
      res.clearCookie('connect.sid')
      return res.json({ msg: 'logging you out' })
    }
    return res.json({ msg: 'no user to log out' })
  },
]

const authController = {
  getBasicUserInfo,
  logoutUser,
}

export default authController
