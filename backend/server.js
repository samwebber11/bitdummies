import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import https from 'https'
import fs from 'fs'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
import path from 'path'

import router from './routes'
import authRouter from './routes/auth'
import orderRouter from './routes/order'
import productsRouter from './routes/products'
import userRouter from './routes/user'
import passport from './passport'
import keys from './config/keys'
import './database'
import schema from './graphql/'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware.
app.use('*', cors())
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

// Serving static files/images.
app.use('/static', express.static(path.join(__dirname, 'public')))

// GraphQl ServerSetUp
app.use(
  '/graphql',
  cors(),
  graphqlHTTP({
    schema,
    rootValue: global,
    graphiql: true,
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
app.use('/user', userRouter)

// Error handler.
app.use((err, req, res, next) =>
  res.status(err.status || 500).send(err.message || 'There was a problem')
)

// Options for certification and encryption.
const options = {
  key: fs.readFileSync('./config/privatekey.pem'),
  cert: fs.readFileSync('./config/certificate.pem'),
  // requestCert :false,
  // rejectUnauthorized: false,
}

const server = https.createServer(options, app)
server.listen(PORT, () => {
  console.log(`Express App listening on port ${PORT}`)
})
