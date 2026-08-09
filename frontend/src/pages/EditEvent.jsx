import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import organizerService from "../services/organizerServices.js";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await organizerService.getEventById(id);

        if (!event) {
          toast.error("Event not found.");
          navigate("/my-events");
          return;
        }

        setEventData({
          title: event.title,
          description: event.description,
          category: event.category,
          date: event.date.slice(0, 10),
          startTime: event.startTime,
          endTime: event.endTime,
          registrationStart:
            event.registrationStart.slice(0, 10),
          registrationEnd:
            event.registrationEnd.slice(0, 10),
          venue: event.venue,
          totalSeats: event.totalSeats,
        });
      } catch (error) {
        toast.error("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !eventData.title ||
      !eventData.description ||
      !eventData.category ||
      !eventData.date ||
      !eventData.startTime ||
      !eventData.endTime ||
      !eventData.registrationStart ||
      !eventData.registrationEnd ||
      !eventData.venue ||
      !eventData.totalSeats
    ) {
      return toast.error("Please fill all fields.");
    }

    if (
      new Date(eventData.registrationStart) >
      new Date(eventData.registrationEnd)
    ) {
      return toast.error(
        "Registration end must be after registration start."
      );
    }

    if (
      new Date(eventData.registrationEnd) >
      new Date(eventData.date)
    ) {
      return toast.error(
        "Registration must close before the event date."
      );
    }

    try {
      setSaving(true);

      await organizerService.updateEvent(id, {
        ...eventData,
        category: eventData.category.toLowerCase(),
        totalSeats: Number(eventData.totalSeats),
      });

      toast.success("Event updated successfully!");

      navigate("/my-events");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-3xl font-bold">
                Loading Event...
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Edit Event
            </h1>

            <p className="text-gray-600 mt-2">
              Update your event information.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="competition">Competition</option>
                  <option value="technical talk">Technical Talk</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Event Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Total Seats
                  </label>

                  <input
                    type="number"
                    name="totalSeats"
                    value={eventData.totalSeats}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Start Time
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
                  <label className="block text-sm font-semibold mb-2">
                    End Time
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Registration Starts
                  </label>

                  <input
                    type="date"
                    name="registrationStart"
                    value={eventData.registrationStart}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Registration Ends
                  </label>

                  <input
                    type="date"
                    name="registrationEnd"
                    value={eventData.registrationEnd}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Venue
                </label>

                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition disabled:bg-yellow-300"
              >
                {saving
                  ? "Updating Event..."
                  : "Update Event"}
              </button>

            </form>

          </div>

        </div>

      </div>
    </>
  );
};

export default EditEvent;