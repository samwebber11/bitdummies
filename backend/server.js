import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'

import router from './routes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Express App listening on port ${PORT}`)
})
