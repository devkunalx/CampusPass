import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import organizerServices from "../services/organizerServices";

const OrganizerEventCard = ({
  event,
  removeEvent,
}) => {
  const [deleting, setDeleting] =
    useState(false);

  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await organizerServices.deleteEvent(
        event._id
      );

      removeEvent(event._id);

      toast.success(
        "Event deleted successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to delete event."
      );
    } finally {
      setDeleting(false);
    }
  };

  const now = new Date();

  const registrationStart = new Date(
    event.registrationStart
  );

  const registrationEnd = new Date(
    event.registrationEnd
  );

  let registrationStatus = "Open";
  let statusColor =
    "bg-green-100 text-green-700";

  if (now < registrationStart) {
    registrationStatus = "Opens Soon";
    statusColor =
      "bg-blue-100 text-blue-700";
  } else if (now > registrationEnd) {
    registrationStatus = "Closed";
    statusColor =
      "bg-red-100 text-red-700";
  }

  const seatColor =
    event.availableSeats === 0
      ? "text-red-600"
      : event.availableSeats <= 5
      ? "text-yellow-600"
      : "text-green-600";

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
          {event.description}
        </p>

      </div>

      {/* Details */}

      <div className="border-t border-gray-100 px-6 py-5 space-y-4 text-gray-700">

        <div className="flex justify-between">

          <span>📅 Date</span>

          <span className="font-semibold">
            {new Date(
              event.date
            ).toLocaleDateString()}
          </span>

        </div>

        <div className="flex justify-between">

          <span>🕒 Time</span>

          <span className="font-semibold">
            {event.startTime} -{" "}
            {event.endTime}
          </span>

        </div>

        <div className="flex justify-between items-start gap-3">

          <span>📝 Registration</span>

          <span className="text-right text-sm font-medium">
            {registrationStart.toLocaleString()}
            <br />
            to
            <br />
            {registrationEnd.toLocaleString()}
          </span>

        </div>

        <div className="flex justify-between">

          <span>Status</span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
          >
            {registrationStatus}
          </span>

        </div>

        <div className="flex justify-between">

          <span>📍 Venue</span>

          <span className="font-semibold text-right">
            {event.venue}
          </span>

        </div>

        <div className="flex justify-between">

          <span>Seats</span>

          <span
            className={`font-bold ${seatColor}`}
          >
            {event.availableSeats}/
            {event.totalSeats}
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="bg-gray-50 p-6 flex flex-col gap-3">

        <button
          onClick={() =>
            navigate(
              `/edit-event/${event._id}`
            )
          }
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition"
        >
          Edit Event
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          {deleting
            ? "Deleting..."
            : "Delete Event"}
        </button>

      </div>

    </div>
  );
};

export default OrganizerEventCard;