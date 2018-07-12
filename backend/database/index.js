import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || process.env.LOCAL_DB_URI)

const dbConnection = mongoose.connection
dbConnection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error: ')
)
dbConnection.once('open', () => {
  console.log('Connected to MongoDB')
})

export default dbConnection
