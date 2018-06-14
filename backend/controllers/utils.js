// Middleware for checking is a user is logged in.
export const loggedIn = (req, res, next) => {
  if (req.user) {
    res.locals.isLoggedIn = true
  } else {
    res.locals.isLoggedIn = false
  }
  next()
}

// Performs the same operation as object spread.
export const merge = (prev, next) => Object.assign({}, prev, next)
