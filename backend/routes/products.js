import express from 'express'

import productController from '../controllers/productController'

const router = express.Router()

router.get('/:id', productController.getProductInfo)

router.get('/categories', productController.getAllCategories)

router.get('/', productController.getProductsList)

export default router
