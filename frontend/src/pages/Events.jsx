import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import eventService from "../services/eventService";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-2xl font-bold">Loading Events...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          Upcoming Events
        </h1>

        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}

          </div>
        )}
      </div>
    </>
  );
};

export default Events;