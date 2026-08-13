import { useState } from "react";

const EventCard = ({
  event,
  role,
  registrationStatus,
  onRegister,
  onDelete,
}) => {
  const [registering, setRegistering] = useState(false);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await onRegister(event._id);
    } finally {
      setRegistering(false);
    }
  };

  const seatColor =
    event.availableSeats === 0
      ? "bg-red-100 text-red-700"
      : event.availableSeats <= 5
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";

  const now = new Date();

  const registrationStart = event.registrationStart
    ? new Date(event.registrationStart)
    : null;

  const registrationEnd = event.registrationEnd
    ? new Date(event.registrationEnd)
    : null;

  const registrationNotStarted =
    registrationStart && now < registrationStart;

  const registrationClosed =
    registrationEnd && now > registrationEnd;

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

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

  const now = new Date();

  const eventStarted = now >= eventStart;
  const eventEnded = now >= eventEnd;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Header */}

      <div className="p-6">

        <div className="flex justify-between items-start gap-4">

          <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">
            {event.title}
          </h2>

          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize whitespace-nowrap">
            {event.category}
          </span>

        </div>

        <p className="mt-4 text-gray-500 text-sm leading-6 line-clamp-3">
          {event.description || "No description available."}
        </p>

      </div>

      {/* Details */}

      <div className="border-t border-gray-100 px-6 py-5 space-y-4 text-gray-700">

        <div className="flex justify-between">

          <span>📅 Date</span>

          <span className="font-semibold">
            {new Date(event.date).toLocaleDateString()}
          </span>

        </div>

        <div className="flex justify-between">

          <span>🕒 Event Time</span>

          <span className="font-semibold">
            {formatTime(event.startTime)} -{" "}
            {formatTime(event.endTime)}
          </span>

        </div>

        <div className="flex justify-between gap-3">

          <span>📝 Registration</span>

          <div className="text-right text-sm font-semibold">

            <p>
              Opens
              <br />
              {registrationStart
                ? registrationStart.toLocaleString()
                : "-"}
            </p>

            <p className="mt-2">
              Closes
              <br />
              {registrationEnd
                ? registrationEnd.toLocaleString()
                : "-"}
            </p>

          </div>

        </div>

        <div className="flex justify-between gap-3">

          <span>📍 Venue</span>

          <span className="font-semibold text-right">
            {event.venue}
          </span>

        </div>

        <div className="flex justify-between gap-3">

          <span>👤 Organizer</span>

          <span className="font-semibold text-right">
            {event.organizer?.fullName}
          </span>

        </div>

        <div className="flex justify-between items-center">

          <span>Seats</span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${seatColor}`}
          >
            {event.availableSeats}/{event.totalSeats}
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="bg-gray-50 p-6">

        {role === "student" && (
          <>
            {/* Registration Status */}

            <div className="mb-4 flex justify-center">

              {registrationNotStarted ? (

                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                  Registration Opens Soon
                </span>

              ) : registrationClosed ? (

                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                  Registration Closed
                </span>

              ) : (

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  Registration Open
                </span>

              )}

            </div>

            {registrationStatus === "confirmed" ? (

              <button
                disabled
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                ✓ Registered
              </button>

            ) : registrationStatus === "waitlisted" ? (

              <button
                disabled
                className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                ⏳ Waitlisted
              </button>

            ) : registrationNotStarted ? (

              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                Registration Opens Soon
              </button>

            ) : registrationClosed ? (

              <button
                disabled
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                Registration Closed
              </button>

            ) : event.availableSeats === 0 ? (

              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-semibold transition disabled:bg-yellow-400 disabled:cursor-not-allowed"
              >
                {registering
                  ? "Joining Waitlist..."
                  : "Join Waitlist"}
              </button>

            ) : (

              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {registering
                  ? "Registering..."
                  : "Register"}
              </button>

            )}
          </>
        )}

        {role === "admin" && (
          <button
            onClick={() => onDelete(event._id)}
            disabled={eventStarted}
            className={`w-full py-3 rounded-xl font-semibold transition ${eventStarted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
              }`}
          >
            {eventEnded
              ? "Event Ended"
              : eventStarted
                ? "Event In Progress"
                : "Delete Event"}
          </button>
        )}

      </div>

    </div>
  );
};

export default EventCard;