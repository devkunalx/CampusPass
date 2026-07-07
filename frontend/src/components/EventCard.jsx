const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">

      <h2 className="text-xl font-bold">
        {event.title}
      </h2>

      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mt-2">
        {event.category}
      </span>

      <div className="mt-4 space-y-2 text-gray-600">

        <p>
          <strong>Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>

        <p>
          <strong>Venue:</strong> {event.venue}
        </p>

        <p>
          <strong>Seats Left:</strong>{" "}
          {event.availableSeats}/{event.totalSeats}
        </p>

        <p>
          <strong>Organizer:</strong>{" "}
          {event.organizer?.fullName}
        </p>

      </div>

    </div>
  );
};

export default EventCard;