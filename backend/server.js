import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'

import router from './routes'
import authRouter from './routes/auth'
import orderRouter from './routes/order'
import productsRouter from './routes/products'
import passport from './passport'
import keys from './config/keys'
import './database'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware.
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: false,
  })
)

// Initialize Passport.
app.use(passport.initialize())
app.use(passport.session())

// Routes.
app.use('/', router)
app.use('/auth', authRouter)
app.use('/order', orderRouter)
app.use('/products', productsRouter)

// Error handler.
app.use((err, req, res, next) =>
  res.status(err.status || 500).send(err.message || 'There was a problem')
)

app.listen(PORT, () => {
  console.log(`Express App listening on port ${PORT}`)
})
