import express from 'express'

import Product from '../database/models/product'

const router = express.Router()

router.get('/:id', (req, res, next) => {
  console.log('==== req.params ====')
  console.log(req.params)
  console.log('==== end ====')
  Product.findById(req.params.id).exec((err, product) => {
    if (err) return next(err)

    if (!product) {
      const error = new Error('Product not found')
      error.status = 404
      return next(error)
    }

    return res.json({ product })
  })
})

router.get('/', (req, res, next) => {
  const query = Object.assign({}, { inStock: true }, req.query)
  Product.find(query, 'name category price image').exec((err, productsList) => {
    if (err) return next(err)

    if (productsList.length === 0) {
      const error = new Error(
        'No products in the database match the given query'
      )
      error.status = 400
      return next(error)
    }

    return res.json({ productsList })
  })
})

export default router
