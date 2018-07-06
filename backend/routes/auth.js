import express from 'express'

import authController from '../controllers/authController'
import passport from '../passport'

const router = express.Router()

// Authenticate with Google.
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile email'],
  })
)

// Callback route for Google to redirect to.
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['profile email'],
  })
)

// Callback for Facebook to redirect
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)

// This route is just used to get the user basic info.
router.get('/user', authController.getBasicUserInfo)

// Route for logging the user out.
router.post('/logout', authController.logoutUser)

export default router
