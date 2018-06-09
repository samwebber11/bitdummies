import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
)

router.get(
  '/auth/google/redirect',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
)

router.post('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy()
    req.logout()
    res.clearCookie('connect.sid')
    return res.json({ msg: 'logging you out' })
  }
  return res.json({ msg: 'no user to log out' })
})

export default router
