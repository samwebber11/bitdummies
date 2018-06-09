import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'

import authRouter from './routes/auth'
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
app.use('/auth', authRouter)
app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/')
})

// Error handler.
app.use((err, req, res, next) => {
  console.log('====== ERROR =======')
  console.error(err.stack)
  res.status(500)
})

app.listen(PORT, () => {
  console.log(`Express App listening on port ${PORT}`)
})
