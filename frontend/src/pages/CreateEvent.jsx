import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import organizerService from "../services/organizerServices.js";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    registrationStart: "",
    registrationEnd: "",
    venue: "",
    totalSeats: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } = eventData;

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !startTime ||
      !endTime ||
      !registrationStart ||
      !registrationEnd ||
      !venue ||
      !totalSeats
    ) {
      return toast.error("Please fill all fields.");
    }

    if (Number(totalSeats) <= 0) {
      return toast.error("Total seats must be greater than 0.");
    }

    const eventStart = new Date(`${date}T${startTime}`);
    const eventEnd = new Date(`${date}T${endTime}`);
    const regStart = new Date(registrationStart);
    const regEnd = new Date(registrationEnd);

    if (eventEnd <= eventStart) {
      return toast.error(
        "Event end time must be after start time."
      );
    }

    if (regEnd <= regStart) {
      return toast.error(
        "Registration closing time must be after opening time."
      );
    }

    if (regEnd > eventStart) {
      return toast.error(
        "Registration must close before the event starts."
      );
    }

    try {
      setCreating(true);

      await organizerService.createEvent({
        ...eventData,
        category: category.toLowerCase(),
        totalSeats: Number(totalSeats),
      });

      toast.success("Event created successfully!");

      navigate("/my-events");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to create event."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Create Event
            </h1>

            <p className="text-gray-600 mt-2">
              Fill in the details below to publish a new campus event.
            </p>
          </div>

          {/* Form */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Title */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              {/* Description */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              {/* Category */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Competition">Competition</option>
                  <option value="Technical Talk">Technical Talk</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>

              {/* Event Date */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              {/* Event Timing */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={eventData.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={eventData.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>
              </div>

              {/* Registration Window */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Opens
                  </label>

                  <input
                    type="datetime-local"
                    name="registrationStart"
                    value={eventData.registrationStart}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Closes
                  </label>

                  <input
                    type="datetime-local"
                    name="registrationEnd"
                    value={eventData.registrationEnd}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>
              </div>

              {/* Venue & Seats */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Venue
                  </label>

                  <input
                    type="text"
                    name="venue"
                    value={eventData.venue}
                    onChange={handleChange}
                    placeholder="Penman Auditorium"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Seats
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="totalSeats"
                    value={eventData.totalSeats}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {creating
                  ? "Creating Event..."
                  : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;