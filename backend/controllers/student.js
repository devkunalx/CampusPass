const studentRouter = require('express').Router()
const Registration = require('../models/registration.model.js')
const authorize = require('../middleware/authorize.middleware.js')

studentRouter.get('/registrations', authorize('student'), async (request, response) => {
    const registrations = await Registration.find({
                        user: request.user._id,
                        status: 'confirmed'
                    })
                    .populate(
                        'event',
                        ['title', 'date', 'venue', 'category']
                    )

    return response.json(registrations)
})