const adminRouter = require("express").Router();

const User = require("../models/user.model");
const Event = require("../models/event.model");
const Registration = require("../models/registration.model");

const authorize = require("../middleware/authorize.middleware");

adminRouter.use(authorize("admin"));

/*
=====================================
Dashboard Statistics
GET /api/admin/dashboard
=====================================
*/

adminRouter.get("/dashboard", async (request, response, next) => {
  try {
    const [
      totalUsers,
      students,
      organizers,
      admins,
      totalEvents,
      activeEvents,
      totalRegistrations,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "student",
      }),

      User.countDocuments({
        role: "organizer",
      }),

      User.countDocuments({
        role: "admin",
      }),

      Event.countDocuments(),

      Event.countDocuments({
        date: {
          $gte: new Date(),
        },
      }),

      Registration.countDocuments({
        status: "confirmed",
      }),
    ]);

    return response.json({
      totalUsers,
      students,
      organizers,
      admins,
      totalEvents,
      activeEvents,
      totalRegistrations,
    });
  } catch (error) {
    next(error);
  }
});

/*
=====================================
Get All Users (Paginated)
GET /api/admin/users
=====================================
*/

adminRouter.get("/users", async (request, response, next) => {
  try {
    const page = Math.max(
      1,
      Number(request.query.page) || 1
    );

    const limit = Math.max(
      1,
      Number(request.query.limit) || 10
    );

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find({})
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return response.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
});

/*
=====================================
Get All Events (Paginated)
GET /api/admin/events
=====================================
*/

adminRouter.get("/events", async (request, response, next) => {
  try {
    const page = Math.max(
      1,
      Number(request.query.page) || 1
    );

    const limit = Math.max(
      1,
      Number(request.query.limit) || 6
    );

    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments();

    const events = await Event.find({})
      .populate("organizer", [
        "fullName",
        "email",
      ])
      .sort({
        date: 1,
      })
      .skip(skip)
      .limit(limit);

    return response.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (error) {
    next(error);
  }
});

/*
=====================================
Delete Any Event
DELETE /api/admin/events/:id
=====================================
*/

adminRouter.delete("/events/:id", async (request, response, next) => {
  try {
    const event = await Event.findById(request.params.id);

    if (!event) {
      return response.status(404).json({
        error: "Event not found",
      });
    }

    await Event.findByIdAndDelete(request.params.id);

    return response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = adminRouter;