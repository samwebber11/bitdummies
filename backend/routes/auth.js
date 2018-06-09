import express from 'express'

import passport from '../passport'

const router = express.Router()

// Authenticate with Google.
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
)

// Callback route for Google to redirect to.
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
  console.log('===== user!!======')
  console.log(req.user)
  if (req.user) {
    return res.json({ user: req.user })
  }
  return res.json({ user: null })
})

router.post('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy()
    // req.logout()
    res.clearCookie('connect.sid')
    return res.json({ msg: 'logging you out' })
  }
  return res.json({ msg: 'no user to log out' })
})

export default router
