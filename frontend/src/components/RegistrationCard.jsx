import { useState } from "react";

const RegistrationCard = ({ registration, onCancel }) => {
  const [cancelling, setCancelling] = useState(false);

  if (!registration || !registration.event) {  
    return null;
  }

  const { event, status } = registration;

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await onCancel(event._id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition duration-300">

      {/* Event Title */}
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
          📌{" "}
          <span
            className={`font-semibold ${
              status === "confirmed"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>

      </div>

      {/* Cancel Button */}

      <button
        onClick={handleCancel}
        disabled={cancelling}
        className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed"
      >
        {cancelling
          ? "Cancelling..."
          : "Cancel Registration"}
      </button>

    </div>
  );
};

export default RegistrationCard;