const eventsRouter = require('express').Router()
const Event = require('../models/event.model.js')
const authorize = require('../middleware/authorize.middleware.js')
const Registration = require('../models/registration.model.js')

eventsRouter.get('/', async (request, response) => {
    const events = await Event.find({})
  .populate('organizer', ['fullName', 'email'])
    response.json(events)
})

eventsRouter.post('/', authorize('organizer', 'admin'), async (request, response) => {
    const {title, description, category, date, venue, totalSeats} = request.body

    const event = new Event({
        title,
        description,
        category,
        date,
        venue,
        totalSeats,
        organizer : request.user._id
    })

    const savedEvent = await event.save()

    response.status(201).json(savedEvent)
})

eventsRouter.get('/:id', async (request,response) => {
    const id = request.params.id;

    const event = await Event.findById(id)

    if (!event) {
        return response
        .status(404)
        .json({
            error: 'Event not found'
        })
    }

    response.json(event)
})

eventsRouter.delete('/:id', authorize('organizer', 'admin'), async (request, response) => {
    const id = request.params.id
    const event = await Event.findById(id)

    if (!event) {
    return response.status(404).json({
        error: 'Event not found'
    })
    }

    if ( event.organizer.toString() !== request.user.id && request.user.role !== 'admin') {
        return response.status(403).json({
            error : 'You are not allowed to delete this event details'
        })
}

    await Event.findByIdAndDelete(id)

    response.status(204).end()
})

eventsRouter.patch('/:id', authorize('organizer', 'admin'), async (request, response) => {

    const id = request.params.id
    const event = await Event.findById(id)

    if ( event.organizer.toString() !== request.user.id && request.user.role !== 'admin') {
        return response.status(403).json({
            error : 'You are not allowed to update this event details'
        })
    }

  const updatedEvent = await Event.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      returnDocument: 'after',
      runValidators: true
    }
  )

  if (!updatedEvent) {
    return response.status(404).json({
      error: 'Event not found'
    })
  }

  response.json(updatedEvent)
})

eventsRouter.post('/:id/register', authorize('student'), async(request, response) => {
    // 1. Authenticate user
    // 2. Ensure user is a student
    // 3. Find event
    // 4. Event exists?
    // 5. Already registered?
    // 6. Seats available?
    // 7. Create Registration
    // 8. Reduce availableSeats
    // 9. Return registration

    const id = request.params.id
    const event = await Event.findById(id)

    if (!event) {
        return response.status(404).json({
            error : 'Event not found'
        })
    }

    const existingRegistration = await Registration.findOne({ user: request.user._id, event: id })

    if (existingRegistration?.status == 'cancelled') {
        existingRegistration.status = 'confirmed'

        const savedRegisteration = await existingRegistration.save()

        return response.status(200).json(savedRegisteration)
    }
    
    if (existingRegistration) {
        return response.status(403).json({
            error : 'You have already registered for this event'
        })
    }

    if (event.availableSeats) {
        const registration = new Registration({
            user : request.user._id,
            event : id,
        })

        const savedRegistration = await registration.save()

        event.availableSeats -= 1
        await event.save()

        return response.status(201).json(savedRegistration)
    }

})

eventsRouter.patch('/:id/register', authorize('student'), async (request, response) => {

    const id = request.params.id

    const event = await Event.findById(id)

    if (!event) {
        return response.status(404).json({
            error : 'Event not found'
        })
    }

    const existingRegistration = await Registration.findOne({user : request.user._id, event : id})

    if (!existingRegistration) {
        return response.status(403).json({
            error : 'You cancel the registeration as you are not registered for this event'
        })
    }

    if (existingRegistration.status === 'cancelled') {
        return response.status(400).json({
            error: 'Registration already cancelled'
        })
    }

    existingRegistration.status = 'cancelled'
    const cancelledRegisteration = await existingRegistration.save()

    event.availableSeats += 1
    await event.save()

    return response.status(200).json(cancelledRegisteration)
})

module.exports = eventsRouter