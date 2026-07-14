import { useState } from "react";

const EventCard = ({
  event,
  role,
  isRegistered,
  onRegister,
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

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">

      {/* Title */}

      <h2 className="text-2xl font-bold text-gray-800">
        {event.title}
      </h2>

      {/* Category */}

      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium capitalize">
        {event.category}
      </span>

      {/* Event Details */}

      <div className="mt-5 space-y-3 text-gray-600">

        <p>
          📅{" "}
          <span className="font-medium">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </p>

        <p>
          📍{" "}
          <span className="font-medium">
            {event.venue}
          </span>
        </p>

        <p>
          👤{" "}
          <span className="font-medium">
            {event.organizer?.fullName}
          </span>
        </p>

        <p>
          💺{" "}
          <span className="font-medium">
            {event.availableSeats} / {event.totalSeats} seats available
          </span>
        </p>

      </div>

      {/* Buttons */}

      <div className="mt-6">

        {role === "student" && (
          <>
            {isRegistered ? (
              <button
                disabled
                className="w-full bg-green-600 text-white py-2 rounded-lg cursor-not-allowed"
              >
                ✓ Registered
              </button>
            ) : event.availableSeats === 0 ? (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
              >
                Event Full
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {registering ? "Registering..." : "Register"}
              </button>
            )}
          </>
        )}

        {role === "organizer" && (
          <div className="flex gap-3">

            <button
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >
              Delete
            </button>

          </div>
        )}

        {role === "admin" && (
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Delete Event
          </button>
        )}

      </div>

    </div>
  );
};

export default EventCard;