import { merge } from './utils'
import Product from '../database/models/product'

const getProductInfo = (req, res, next) => {
  Product.findById(req.params.id).exec((err, product) => {
    if (err) return next(err)

    if (!product) {
      const error = new Error('No product in the database with the given ID')
      error.status = 404
      return next(error)
    }

    return res.json({ product })
  })
}

const getProductsList = (req, res, next) => {
  console.log('==== req.query ====')
  console.log(req.query)
  console.log('==== end ====')

  const query = merge(req.query)
  Product.find(query).exec((err, productsList) => {
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
}

const getAllCategories = (req, res, next) => {
  console.log('==== req.query ====')
  console.log(req.query)
  console.log('==== end ====')

  const query = merge(req.query)
  Product.find(query)
    .distinct('category')
    .exec((err, categories) => {
      if (err) return next(err)

      if (categories.length === 0) {
        const error = new Error('No categories in the database')
        error.status = 400
        return next(error)
      }

      return res.json({ categories })
    })
}

const productController = {
  getProductInfo,
  getProductsList,
  getAllCategories,
}

export default productController
