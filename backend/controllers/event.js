const eventsRouter = require('express').Router()
const Event = require('../models/event.model.js')
const authorize = require('../middleware/authorize.middleware.js')

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

module.exports = eventsRouter