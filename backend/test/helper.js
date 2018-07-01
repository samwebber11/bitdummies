import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const dbURI = 'mongodb://localhost:27017/test-database'
const options = {
  autoIndex: false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  connectTimeoutMS: 10000,
}

const connectMongoose = async () =>
  mongoose.connect(
    dbURI,
    options
  )

const disconnectMongoose = async () => mongoose.connection.close()

const clearDatabase = async () => {
  await mongoose.connection.db.dropDatabase()
}

export { connectMongoose, disconnectMongoose, clearDatabase }
