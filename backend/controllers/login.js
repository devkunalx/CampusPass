const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user.model.js')
const config = require('../utils/config.js')

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  if (!email || !password) {
    return response.status(401).json({
        error: 'missing email or password'
    })
  }

  const user = await User.findOne({ email })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
  email: user.email,
  id: user._id,
  role: user.role
  }

  const token = jwt.sign(
  userForToken,
  config.JWT_SECRET,
  { expiresIn: '7d' }
  )

response.status(200).json({
  token,
  fullName: user.fullName,
  email: user.email,
  role: user.role
})
})

module.exports = loginRouter