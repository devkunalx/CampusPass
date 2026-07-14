import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

import eventService from "../services/eventService";
import registrationService from "../services/registerationService";

import useAuthStore from "../store/useAuthStore.js";

const Events = () => {
  const { auth } = useAuthStore();

  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all events
        const eventData = await eventService.getAllEvents();
        setEvents(eventData);

        // Only students have registrations
        if (auth.role === "student") {
          const registrations =
            await registrationService.getMyRegistrations();

          const registeredIds = new Set(
            registrations.map(
              registration => registration.event._id
            )
          );

          setRegisteredEvents(registeredIds);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
          "Failed to fetch events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.role]);

  const handleRegister = async (eventId) => {
    try {
      await registrationService.registerForEvent(eventId);

      toast.success("Registered Successfully!");

      // Mark event as registered
      setRegisteredEvents(prev => {
        const updated = new Set(prev);
        updated.add(eventId);
        return updated;
      });

      // Reduce available seats immediately
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? {
              ...event,
              availableSeats: event.availableSeats - 1,
            }
            : event
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Registration failed."
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-2xl font-bold">
            Loading Events...
          </h2>
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
          <div className="text-center mt-20">

            <h2 className="text-2xl font-semibold">
              No events available.
            </h2>

            <p className="text-gray-500 mt-2">
              Please check back later.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleRegister}
                isRegistered={registeredEvents.has(event._id)}
                role={auth.role}
              />
            ))}

          </div>
        )}
      </div>
    </>
  );
};

export default Events;