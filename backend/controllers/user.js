const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user.model.js')

usersRouter.get('/all', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/register', async (request, response) => {
  const { fullName, email, password, role } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    fullName,
    email,
    passwordHash,
    role
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter