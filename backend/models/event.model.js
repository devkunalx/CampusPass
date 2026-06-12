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
    enum: ['workshop', 'hackathon', 'seminar', 'cultural', 'sports']
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

eventSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats
  }
  next()
})



module.exports = mongoose.model('Event', eventSchema)