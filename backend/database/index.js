import mongoose from 'mongoose'

import keys from '../config/keys'

mongoose.Promise = global.Promise
mongoose.connect(keys.mongoDB.dbURI)

const dbConnection = mongoose.connection
dbConnection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error: ')
)
dbConnection.once('open', () => {
  console.log('Connected to MongoDB')
})

export default dbConnection
