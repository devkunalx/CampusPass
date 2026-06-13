const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js')
const config = require('../utils/config.js')

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }

  return null
}

const authenticateUser = async (request, response, next) => {
  try {
    const token = getTokenFrom(request)

    if (!token) {
      return response.status(401).json({
        error: 'token missing'
      })
    }

    const decodedToken = jwt.verify(
      token,
      config.JWT_SECRET
    )

    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'token invalid'
      })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({
        error: 'user not found'
      })
    }

    request.user = user

    next()

  } catch (error) {
    next(error)
  }
}

module.exports = authenticateUser