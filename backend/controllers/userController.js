import { merge, loggedIn } from './utils'
import User from '../database/models/user'

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

const userController = {
  getUserAccountInfo,
  getUserListAccountInfo,
}

export default userController
