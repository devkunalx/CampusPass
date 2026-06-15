const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/user.js')
const loginRouter = require('./controllers/login.js')
const eventRouter = require('./controllers/event.js')
const authenticateUser = require('./middleware/authenticateUser.middleware.js')
const studentRouter = require('./controllers/student.js')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
    process.exit(1)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)


// Routers
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/events',authenticateUser, eventRouter)
app.use('api/me', authenticateUser, studentRouter)

// Error and endpoint middlewares
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app