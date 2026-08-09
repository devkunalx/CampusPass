const eventsRouter = require('express').Router()

const { getIO } = require("../socket");

const Event = require('../models/event.model.js')
const authorize = require('../middleware/authorize.middleware.js')
const Registration = require('../models/registration.model.js')

eventsRouter.get('/', async (request, response, next) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 6;

    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments();

    const events = await Event.find({})
      .populate("organizer", ["fullName", "email"])
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalEvents / limit);

    const now = new Date();

    const eventsWithStatus = events.map((event) => ({
      ...event.toObject(),
      registrationOpen:
        now >= event.registrationStart &&
        now <= event.registrationEnd,
    }));

    return response.json({
      events: eventsWithStatus,
      currentPage: page,
      totalPages,
      totalEvents,
    });

  } catch (error) {
    next(error);
  }
});

eventsRouter.get(
  "/my-events",
  authorize("organizer", "admin"),
  async (request, response, next) => {
    try {
      const page = Number(request.query.page) || 1;
      const limit = Number(request.query.limit) || 6;

      const skip = (page - 1) * limit;

      let query = {};

      // Organizer can only see their own events
      if (request.user.role === "organizer") {
        query.organizer = request.user._id;
      }

      // Admin can see all events
      const totalEvents = await Event.countDocuments(query);

      const events = await Event.find(query)
        .populate("organizer", [
          "fullName",
          "email",
        ])
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalEvents / limit);

      return response.status(200).json({
        events,
        currentPage: page,
        totalPages,
        totalEvents,
      });
    } catch (error) {
      next(error);
    }
  }
);

eventsRouter.post(
  "/",
  authorize("organizer", "admin"),
  async (request, response, next) => {
    try {
      const {
        title,
        description,
        category,
        date,
        startTime,
        endTime,
        registrationStart,
        registrationEnd,
        venue,
        totalSeats,
      } = request.body;

      // Registration start must be before registration end
      if (
        new Date(registrationStart) >=
        new Date(registrationEnd)
      ) {
        return response.status(400).json({
          error:
            "Registration end must be after registration start.",
        });
      }

      // Build complete event start datetime
      const eventStart = new Date(
        `${date}T${startTime}`
      );

      // Registration must close before event starts
      if (
        new Date(registrationEnd) >= eventStart
      ) {
        return response.status(400).json({
          error:
            "Registration must close before the event starts.",
        });
      }

      // Event end must be after start
      if (
        startTime >= endTime
      ) {
        return response.status(400).json({
          error:
            "Event end time must be after the start time.",
        });
      }

      const event = new Event({
        title,
        description,
        category,
        date,
        startTime,
        endTime,
        registrationStart,
        registrationEnd,
        venue,
        totalSeats,
        organizer: request.user._id,
      });

      const savedEvent = await event.save();

      response.status(201).json(savedEvent);
    } catch (error) {
      next(error);
    }
  }
);

eventsRouter.get('/:id', async (request, response) => {
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

  if (event.organizer.toString() !== request.user._id.toString() && request.user.role !== 'admin') {
    return response.status(403).json({
      error: 'You are not allowed to delete this event details'
    })
  }

  await Registration.deleteMany({
    event: id,
  });

  await Event.findByIdAndDelete(id)

  response.status(204).end()
})

eventsRouter.patch(
  "/:id",
  authorize("organizer", "admin"),
  async (request, response, next) => {
    try {
      const id = request.params.id;

      const event = await Event.findById(id);

      if (!event) {
        return response.status(404).json({
          error: "Event not found",
        });
      }

      if (
        event.organizer.toString() !== request.user._id.toString() &&
        request.user.role !== "admin"
      ) {
        return response.status(403).json({
          error: "You are not allowed to update this event.",
        });
      }

      const now = new Date();

      // Registration window cannot be edited once it has opened
      if (
        now >= event.registrationStart &&
        (
          request.body.registrationStart ||
          request.body.registrationEnd
        )
      ) {
        return response.status(400).json({
          error:
            "Registration window cannot be modified after registration has started.",
        });
      }

      // Values after update
      const date =
        request.body.date ??
        event.date.toISOString().split("T")[0];

      const startTime =
        request.body.startTime ??
        event.startTime;

      const endTime =
        request.body.endTime ??
        event.endTime;

      const registrationStart =
        request.body.registrationStart ??
        event.registrationStart;

      const registrationEnd =
        request.body.registrationEnd ??
        event.registrationEnd;

      // Registration start < Registration end
      if (
        new Date(registrationStart) >=
        new Date(registrationEnd)
      ) {
        return response.status(400).json({
          error:
            "Registration end must be after registration start.",
        });
      }

      // Event end after event start
      if (startTime >= endTime) {
        return response.status(400).json({
          error:
            "Event end time must be after the start time.",
        });
      }

      // Registration closes before event starts
      const eventStart = new Date(
        `${date}T${startTime}`
      );

      if (
        new Date(registrationEnd) >= eventStart
      ) {
        return response.status(400).json({
          error:
            "Registration must close before the event starts.",
        });
      }

      const updatedEvent =
        await Event.findByIdAndUpdate(
          id,
          request.body,
          {
            new: true,
            runValidators: true,
          }
        );

      response.json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }
);

eventsRouter.post(
  "/:id/register",
  authorize("student"),
  async (request, response, next) => {
    try {
      const id = request.params.id;

      // Find event
      const event = await Event.findById(id);

      if (!event) {
        return response.status(404).json({
          error: "Event not found",
        });
      }

      const now = new Date();

      // Registration has not started
      if (now < event.registrationStart) {
        return response.status(400).json({
          error: "Registration has not started yet.",
        });
      }

      // Registration closed
      if (now > event.registrationEnd) {
        return response.status(400).json({
          error: "Registration for this event has ended.",
        });
      }

      // Event already started
      const eventStart = new Date(
        `${event.date.toISOString().split("T")[0]}T${event.startTime}`
      );

      if (now >= eventStart) {
        return response.status(400).json({
          error: "This event has already started.",
        });
      }

      // Already registered?
      const existingRegistration = await Registration.findOne({
        user: request.user._id,
        event: id,
      });

      if (existingRegistration) {
        if (existingRegistration.status === "cancelled") {
          // Try to reserve a seat atomically
          const updatedEvent = await Event.findOneAndUpdate(
            {
              _id: id,
              availableSeats: { $gt: 0 },
            },
            {
              $inc: {
                availableSeats: -1,
              },
            },
            {
              new: true,
            }
          );

          if (updatedEvent) {
            existingRegistration.status = "confirmed";
          } else {
            existingRegistration.status = "waitlisted";
          }

          await existingRegistration.save();

          // Notify all connected clients
          if (updatedEvent) {
            const io = getIO();

            io.emit("seatUpdated", {
              eventId: id,
              availableSeats: updatedEvent.availableSeats,
            });
          }

          return response.status(200).json({
            message:
              existingRegistration.status === "confirmed"
                ? "Registration confirmed."
                : "Added to waitlist.",
            registration: existingRegistration,
          });
        }

        return response.status(400).json({
          error: "You have already registered for this event.",
        });
      }

      // Try to reserve a seat atomically
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: id,
          availableSeats: { $gt: 0 },
        },
        {
          $inc: {
            availableSeats: -1,
          },
        },
        {
          new: true,
        }
      );

      // Seat available → Confirm registration
      if (updatedEvent) {
        const registration = new Registration({
          user: request.user._id,
          event: id,
          status: "confirmed",
        });

        await registration.save();

        // Notify all connected clients
        const io = getIO();

        io.emit("seatUpdated", {
          eventId: id,
          availableSeats: updatedEvent.availableSeats,
        });

        return response.status(201).json({
          message: "Registered successfully.",
          registration,
        });
      }

      // No seats available → Waitlist
      const registration = new Registration({
        user: request.user._id,
        event: id,
        status: "waitlisted",
      });

      await registration.save();

      return response.status(201).json({
        message: "Event is full. You have been added to the waitlist.",
        registration,
      });
    } catch (error) {
      if (error.code === 11000) {
        return response.status(400).json({
          error: "You have already registered for this event.",
        });
      }

      next(error);
    }
  }
);

eventsRouter.patch(
  "/:id/register",
  authorize("student"),
  async (request, response, next) => {
    try {
      const id = request.params.id;

      const event = await Event.findById(id);

      if (!event) {
        return response.status(404).json({
          error: "Event not found",
        });
      }

      const existingRegistration =
        await Registration.findOne({
          user: request.user._id,
          event: id,
        });

      if (!existingRegistration) {
        return response.status(404).json({
          error: "You are not registered for this event.",
        });
      }

      if (existingRegistration.status === "cancelled") {
        return response.status(400).json({
          error: "Registration already cancelled.",
        });
      }

      // Cancel registration
      existingRegistration.status = "cancelled";
      const cancelledRegistration =
        await existingRegistration.save();

      // Promote oldest waitlisted student
      const promotedStudent =
        await Registration.findOneAndUpdate(
          {
            event: id,
            status: "waitlisted",
          },
          {
            $set: {
              status: "confirmed",
            },
          },
          {
            sort: {
              createdAt: 1,
            },
            new: true,
          }
        );

      const io = getIO();

      // Someone promoted from waitlist
      if (promotedStudent) {
        await promotedStudent.populate(
          "user",
          ["fullName", "email"]
        );

        // Seat count stays exactly the same
        io.to(promotedStudent.user._id.toString()).emit(
          "registrationPromoted",
          {
            eventId: id,
            message:
              "You have been promoted from the waitlist!"
          }
        );

        return response.status(200).json({
          message:
            "Registration cancelled successfully. The next student on the waitlist has been promoted.",
          cancelledRegistration,
          promotedStudent,
        });
      }

      // Nobody on waitlist -> free one seat
      const updatedEvent =
        await Event.findByIdAndUpdate(
          id,
          {
            $inc: {
              availableSeats: 1,
            },
          },
          {
            new: true,
          }
        );

      io.emit("seatUpdated", {
        eventId: id,
        availableSeats:
          updatedEvent.availableSeats,
      });

      return response.status(200).json({
        message:
          "Registration cancelled successfully.",
        cancelledRegistration,
      });
    } catch (error) {
      next(error);
    }
  }
);

eventsRouter.get('/:id/registrations', authorize('organizer', 'admin'), async (request, response, next) => {
  try {
    const id = request.params.id;

    // Find the event
    const event = await Event.findById(id);

    if (!event) {
      return response.status(404).json({
        error: 'Event not found',
      });
    }

    // Only the organizer of this event or an admin can view registrations
    if (
      request.user.role !== 'admin' &&
      event.organizer.toString() !== request.user._id.toString()
    ) {
      return response.status(403).json({
        error: 'You are not allowed to view registrations for this event',
      });
    }

    // Fetch confirmed registrations
    const registrations = await Registration.find({
      event: id,
      status: 'confirmed',
    })
      .populate('user', ['fullName', 'email'])
      .populate('event', [
        'title',
        'date',
        'venue',
        'category',
      ]);

    return response.status(200).json({
      totalRegistrations: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
}
);

module.exports = eventsRouter