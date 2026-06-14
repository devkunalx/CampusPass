const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    category: {
    type: String,
    enum: ['workshop', 'hackathon', 'seminar', 'cultural', 'sports', 'technology']
    },

    date: {
      type: Date,
      required: true
    },

    venue: {
      type: String,
      required: true,
      trim: true
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },

    availableSeats: {
      type: Number,
      min: 0
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

eventSchema.pre('save', function () {
  if (this.isNew) {
    this.availableSeats = this.totalSeats
  }
})


module.exports = mongoose.model('Event', eventSchema)