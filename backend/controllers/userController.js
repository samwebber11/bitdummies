import { body, validationResult } from 'express-validator/check'
import { sanitizeBody } from 'express-validator/filter'
import async from 'async'

import { merge, loggedIn } from './utils'
import User from '../database/models/user'
import Product from '../database/models/product'
import Address from '../database/models/address'
import Order from '../database/models/order'

const getUserAccountInfo = [
  loggedIn,
  (req, res, next) => {
    if (!res.locals.isLoggedIn || req.user._id !== req.params.id) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    console.log('==== req.params ====')
    console.log(req.params)
    console.log('==== end ====')

    User.findById(req.params.id, 'email firstName lastName phone address')
      .populate('address')
      .exec((err, user) => {
        if (err) return next(err)

        if (!user) {
          const error = new Error('User not found')
          error.status = 404
          return next(error)
        }

        return res.json({ user })
      })
  },
]

const getUserListAccountInfo = [
  loggedIn,
  (req, res, next) => {
    if (!res.locals.isLoggedIn) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    console.log('==== req.query ====')
    console.log(req.query)
    console.log('==== end ====')

    const query = merge(req.query)
    User.find(query)
      .populate('address')
      .exec((err, userList) => {
        if (err) return next(err)

        if (userList.length === 0) {
          const error = new Error(
            'No users in the database match the given query'
          )
          error.status = 404
          return next(error)
        }

        return res.json({ userList })
      })
  },
]

const updateUserInfo = [
  // Make sure the user is authenticated.
  loggedIn,
  (req, res, next) => {
    if (!res.locals.isLoggedIn || req.user._id !== req.params.id) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }
  },

  // Validate inputs.
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('firstName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlpha()
    .withMessage('First name has non-alphabetic characters.'),
  body('lastName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Last name must be specified.')
    .isAlpha()
    .withMessage('Last name has non-alphabetic characters.'),
  // TODO: Verify phone number.
  body('phone')
    .isMobilePhone()
    .withMessage('Phone number must be valid a mobile phone number.'),
  // TODO: Validate address.
  // body('address1')
  //   .isLength({ min: 1 })
  //   .trim()
  //   .withMessage('Address1 must be specified.'),
  // body('city')
  //   .isLength({ min: 1 })
  //   .trim()
  //   .withMessage('City must be specified.')
  //   .isAlpha()
  //   .withMessage('City has non-alphabetic characters.'),
  // body('state')
  //   .isLength({ min: 1 })
  //   .trim()
  //   .withMessage('State must be specified.')
  //   .isAlpha()
  //   .withMessage('State has non-alphabetic characters.'),
  // body('zip')
  //   .isPostalCode('any')
  //   .withMessage('Zip code must be a valid zip code.'),
  // body('country')
  //   .isLength({ min: 1 })
  //   .trim()
  //   .withMessage('Country must be specified.')
  //   .isISO31661Alpha2()
  //   .withMessage('Country must be valid.'),

  // Sanitize fields.
  sanitizeBody('email').trim(),
  sanitizeBody('firstName')
    .trim()
    .escape(),
  sanitizeBody('lastName')
    .trim()
    .escape(),
  sanitizeBody('phone')
    .trim()
    .escape(),
  // sanitizeBody('address1')
  //   .trim()
  //   .escape(),
  // sanitizeBody('address2')
  //   .trim()
  //   .escape(),
  // sanitizeBody('city')
  //   .trim()
  //   .escape(),
  // sanitizeBody('state')
  //   .trim()
  //   .escape(),
  // sanitizeBody('zip')
  //   .trim()
  //   .escape(),
  // sanitizeBody('country')
  //   .trim()
  //   .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from the request.
    const errors = validationResult(req)

    const user = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    }

    console.log('userController: req.user: ', req.user)

    if (!errors.isEmpty()) {
      // There are errors.
      return res.json({ errors })
    }

    User.findByIdAndUpdate(req.user._id, user, (err, updatedUser) => {
      if (err) return next(err)

      return res.json({ user: updatedUser })
    })
  },
]

const createNewOrder = [
  loggedIn,
  (req, res, next) => {
    if (!res.locals.isLoggedIn || req.user._id !== req.params.id) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    const { products, address, payment } = req.body
    const productIDs = products.map(product => product._id)

    async.waterfall(
      [
        outerCallback => {
          async.parallel(
            {
              productsList: callback => {
                Product.find({ _id: { $in: productIDs } }).exec(callback)
              },
              deliveryAddress: callback => {
                Address.findById(address._id).exec(callback)
              },
            },
            (err, results) => {
              if (err) return next(err)

              const { productsList, deliveryAddress } = results
              if (productsList.length !== productIDs.length) {
                const error = new Error(
                  'Some products not found in the database.'
                )
                error.status = 404
                return next(error)
              }

              const productsToBeStored = []
              products.forEach(orderedProduct => {
                const product = productsList.find(
                  p => p._id === orderedProduct._id
                )
                if (product.quantity < orderedProduct.quantity) {
                  const error = new Error(
                    'One or more items in your order are less in stock.'
                  )
                  error.status = 400
                  return next(error)
                }

                const productToBeStored = {
                  productID: product._id,
                  quantity: orderedProduct.quantity,
                  price: product.price,
                }
                productsToBeStored.push(productToBeStored)
              })

              // TODO: Make sure the payment is complete.
              const order = new Order({
                product: productsToBeStored,
                status: 'Processing',
                payment: {
                  status: payment.status,
                  mode: payment.mode,
                  transactionID: payment.transactionID,
                },
                shippingAddress: deliveryAddress,
              })

              outerCallback(null, order)
            }
          )
        },
      ],
      (err, result) => {
        if (err) return next(err)

        result.order.save().then((error, savedOrder) => {
          if (error) return next(error)

          res.json({ msg: 'Success' })
        })
      }
    )
  },
]

const getOrderDetails = () => true

const updateOrderDetails = () => true

const userController = {
  getUserAccountInfo,
  getUserListAccountInfo,
  updateUserInfo,
  createNewOrder,
  getOrderDetails,
  updateOrderDetails,
}

export default userController
