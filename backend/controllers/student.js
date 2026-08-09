const studentsRouter = require('express').Router()
const Registration = require('../models/registration.model.js')
const authorize = require('../middleware/authorize.middleware.js')

studentsRouter.get(
  "/registrations",
  authorize("student"),
  async (request, response) => {

    const registrations = await Registration.find({
      user: request.user._id,
    }).populate("event");

    const validRegistrations =
      registrations.filter(
        (registration) => registration.event
      );

    return response.json(validRegistrations);
  }
);

module.exports = studentsRouter;