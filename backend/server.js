import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'

const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3001

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Express App listening on port ${PORT}`)
})
