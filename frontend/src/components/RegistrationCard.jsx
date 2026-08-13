import { useState } from "react";

const RegistrationCard = ({ registration, onCancel }) => {
  const [cancelling, setCancelling] = useState(false);

  if (!registration || !registration.event) {
    return null;
  }

  const { event, status } = registration;

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

  const cancellationDisabled =
    registrationNotStarted || registrationClosed;

  const handleCancel = async () => {
    if (cancellationDisabled) return;

    try {
      setCancelling(true);
      await onCancel(event._id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">

      {/* Header */}

      <div className="p-6">

        <div className="flex justify-between items-start gap-3">

          <h2 className="text-2xl font-bold text-gray-800">
            {event.title}
          </h2>

          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize whitespace-nowrap">
            {event.category}
          </span>

        </div>

      </div>

      {/* Event Details */}

      <div className="border-t border-gray-100 px-6 py-5 space-y-4 text-gray-700">

        {/* Date */}

        <div className="flex justify-between gap-3">

          <span>📅 Date</span>

          <span className="font-semibold text-right">
            {new Date(event.date).toLocaleDateString()}
          </span>

        </div>

        {/* Event Time */}

        {event.startTime && event.endTime && (
          <div className="flex justify-between gap-3">

            <span>🕒 Time</span>

            <span className="font-semibold text-right">
              {event.startTime} - {event.endTime}
            </span>

          </div>
        )}

        {/* Venue */}

        <div className="flex justify-between gap-3">

          <span>📍 Venue</span>

          <span className="font-semibold text-right">
            {event.venue}
          </span>

        </div>

        {/* Registration Status */}

        <div className="flex justify-between gap-3">

          <span>📌 Status</span>

          <span
            className={`font-semibold ${
              status === "confirmed"
                ? "text-green-600"
                : status === "waitlisted"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>

        </div>

        {/* Registration Window */}

        {registrationStart && registrationEnd && (
          <div className="flex justify-between items-start gap-3">

            <span>📝 Registration</span>

            <div className="text-right text-sm font-medium">

              <p>
                Opens:
                <br />
                {registrationStart.toLocaleString()}
              </p>

              <p className="mt-2">
                Closes:
                <br />
                {registrationEnd.toLocaleString()}
              </p>

            </div>

          </div>
        )}

      </div>

      {/* Cancellation Status */}

      {registrationNotStarted && (
        <div className="px-6 pt-5">
          <div className="bg-gray-100 text-gray-600 text-sm text-center rounded-xl px-4 py-3">
            Registration has not opened yet.
          </div>
        </div>
      )}

      {registrationClosed && (
        <div className="px-6 pt-5">
          <div className="bg-red-100 text-red-700 text-sm text-center rounded-xl px-4 py-3">
            Registration is closed. Cancellation is no longer available.
          </div>
        </div>
      )}

      {/* Cancel Button */}

      <div className="p-6">

        <button
          onClick={handleCancel}
          disabled={
            cancelling || cancellationDisabled
          }
          className={`w-full py-3 rounded-xl font-semibold transition ${
            cancellationDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {cancelling
            ? "Cancelling..."
            : cancellationDisabled
            ? registrationNotStarted
              ? "Cancellation Not Available Yet"
              : "Cancellation Closed"
            : "Cancel Registration"}
        </button>

      </div>

    </div>
  );
};

export default RegistrationCard;