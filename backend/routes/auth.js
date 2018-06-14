import express from 'express'

import authController from '../controllers/authController'

const router = express.Router()

// Authenticate with Google.
router.get('/google', authController.authenticateGoogle)

// Callback route for Google to redirect to.
router.get('/google/callback', authController.authenticateGoogleCallback)

// This route is just used to get the user basic info.
router.get('/user', authController.getBasicUserInfo)

// Route for logging the user out.
router.post('/logout', authController.logoutUser)

export default router
