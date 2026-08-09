const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "workshop",
        "hackathon",
        "seminar",
        "cultural",
        "sports",
        "technology",
      ],
    },

    // Event Date
    date: {
      type: Date,
      required: true,
    },

    // Event Timing
    startTime: {
      type: String,
      required: true, // HH:mm
    },

    endTime: {
      type: String,
      required: true, // HH:mm
    },

    // Registration Window
    registrationStart: {
      type: Date,
      required: true,
    },

    registrationEnd: {
      type: Date,
      required: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      min: 0,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Initialize available seats
eventSchema.pre("save", function () {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
});

// Validation
eventSchema.pre("validate", function () {
  // Registration start < Registration end
  if (
    this.registrationStart &&
    this.registrationEnd &&
    this.registrationStart >= this.registrationEnd
  ) {
    throw new Error(
      "Registration start must be before registration end."
    );
  }

  // Start time < End time
  if (
    this.startTime &&
    this.endTime &&
    this.startTime >= this.endTime
  ) {
    throw new Error(
      "Event start time must be before end time."
    );
  }

  // Registration must end before the event starts
  if (
    this.registrationEnd &&
    this.date &&
    this.startTime
  ) {
    const eventStart = new Date(this.date);

    const [hours, minutes] = this.startTime
      .split(":")
      .map(Number);

    eventStart.setHours(hours, minutes, 0, 0);

    if (this.registrationEnd >= eventStart) {
      throw new Error(
        "Registration must close before the event starts."
      );
    }
  }
});

module.exports = mongoose.model("Event", eventSchema);