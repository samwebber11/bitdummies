import express from 'express'

import userController from '../controllers/userController'

const router = express.Router()

router.post('/:id/updateInfo', userController.updateUserInfo)

router.post('/:id/order/newOrder', userController.createNewOrder)

router.get('/:id/order/:orderID', userController.getOrderDetails)

router.post('/:id/order/:orderID', userController.updateOrderDetails)

router.get('/:id', userController.getUserAccountInfo)

router.get('/', userController.getUserListAccountInfo)

export default router
