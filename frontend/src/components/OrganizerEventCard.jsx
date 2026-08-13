import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import organizerServices from "../services/organizerServices";

const OrganizerEventCard = ({
  event,
  removeEvent,
}) => {
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const now = new Date();

  // -----------------------------
  // Registration window
  // -----------------------------

  const registrationStart = event.registrationStart
    ? new Date(event.registrationStart)
    : null;

  const registrationEnd = event.registrationEnd
    ? new Date(event.registrationEnd)
    : null;

  let registrationStatus = "Open";
  let statusColor = "bg-green-100 text-green-700";

  if (registrationStart && now < registrationStart) {
    registrationStatus = "Opens Soon";
    statusColor = "bg-blue-100 text-blue-700";
  } else if (registrationEnd && now > registrationEnd) {
    registrationStatus = "Closed";
    statusColor = "bg-red-100 text-red-700";
  }

  // -----------------------------
  // Event start / end
  // -----------------------------

  let eventStarted = false;
  let eventEnded = false;

  if (event.date && event.startTime && event.endTime) {
    const eventDate = new Date(event.date);

    const [startHour, startMinute] = event.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = event.endTime
      .split(":")
      .map(Number);

    const eventStart = new Date(eventDate);
    eventStart.setHours(startHour, startMinute, 0, 0);

    const eventEnd = new Date(eventDate);
    eventEnd.setHours(endHour, endMinute, 0, 0);

    eventStarted = now >= eventStart;
    eventEnded = now >= eventEnd;
  }

  // -----------------------------
  // Delete
  // -----------------------------

  const handleDelete = async () => {
    // Extra protection in frontend
    if (eventStarted) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await organizerServices.deleteEvent(event._id);

      removeEvent(event._id);

      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to delete event."
      );
    } finally {
      setDeleting(false);
    }
  };

  // -----------------------------
  // Seats
  // -----------------------------

  const seatColor =
    event.availableSeats === 0
      ? "text-red-600"
      : event.availableSeats <= 5
      ? "text-yellow-600"
      : "text-green-600";

  // -----------------------------
  // Time formatter
  // -----------------------------

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 overflow-hidden">

      {/* Header */}

      <div className="p-6">

        <div className="flex justify-between items-start gap-3">

          <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">
            {event.title}
          </h2>

          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize whitespace-nowrap">
            {event.category}
          </span>

        </div>

        <p className="mt-4 text-gray-500 line-clamp-3">
          {event.description || "No description available."}
        </p>

      </div>

      {/* Details */}

      <div className="border-t border-gray-100 px-6 py-5 space-y-4 text-gray-700">

        {/* Date */}

        <div className="flex justify-between gap-3">

          <span>📅 Date</span>

          <span className="font-semibold text-right">
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : "-"}
          </span>

        </div>

        {/* Event Time */}

        <div className="flex justify-between gap-3">

          <span>🕒 Time</span>

          <span className="font-semibold text-right">
            {formatTime(event.startTime)} -{" "}
            {formatTime(event.endTime)}
          </span>

        </div>

        {/* Registration */}

        <div className="flex justify-between items-start gap-3">

          <span>📝 Registration</span>

          <div className="text-right text-sm font-medium">

            <p>
              {registrationStart
                ? registrationStart.toLocaleString()
                : "-"}
            </p>

            <p className="my-1 text-gray-400">
              to
            </p>

            <p>
              {registrationEnd
                ? registrationEnd.toLocaleString()
                : "-"}
            </p>

          </div>

        </div>

        {/* Registration Status */}

        <div className="flex justify-between items-center">

          <span>Status</span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
          >
            {registrationStatus}
          </span>

        </div>

        {/* Venue */}

        <div className="flex justify-between gap-3">

          <span>📍 Venue</span>

          <span className="font-semibold text-right">
            {event.venue || "-"}
          </span>

        </div>

        {/* Seats */}

        <div className="flex justify-between items-center">

          <span>Seats</span>

          <span className={`font-bold ${seatColor}`}>
            {event.availableSeats}/{event.totalSeats}
          </span>

        </div>

      </div>

      {/* Event Status */}

      {eventStarted && (
        <div className="px-6 pt-5">

          <div className="bg-gray-100 text-gray-600 text-sm text-center rounded-xl px-4 py-3 font-medium">
            {eventEnded
              ? "This event has ended."
              : "This event is currently in progress."}
          </div>

        </div>
      )}

      {/* Footer */}

      <div className="bg-gray-50 p-6 flex flex-col gap-3">

        {/* Edit */}

        <button
          onClick={() => {
            if (!eventStarted) {
              navigate(`/edit-event/${event._id}`);
            }
          }}
          disabled={eventStarted}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            eventStarted
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {eventEnded
            ? "Editing Closed"
            : eventStarted
            ? "Event In Progress"
            : "Edit Event"}
        </button>

        {/* Delete */}

        <button
          onClick={handleDelete}
          disabled={deleting || eventStarted}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            eventStarted
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300 disabled:cursor-not-allowed"
          }`}
        >
          {deleting
            ? "Deleting..."
            : eventEnded
            ? "Deletion Closed"
            : eventStarted
            ? "Event In Progress"
            : "Delete Event"}
        </button>

      </div>

    </div>
  );
};

export default OrganizerEventCard;