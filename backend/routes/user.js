import express from 'express'

import userController from '../controllers/userController'

const router = express.Router()

router.get('/:id', userController.getUserAccountInfo)

router.get('/', userController.getUserListAccountInfo)

router.post('/updateInfo', userController.updateUserInfo)

export default router
