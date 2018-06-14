import express from 'express'

import orderController from '../controllers/orderController'

const router = express.Router()

router.get('/:id', orderController.getOrderInfo)

router.get('/', orderController.getOrdersList)

export default router
