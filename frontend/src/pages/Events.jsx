import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "../socket.js";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

import eventService from "../services/eventService";
import registrationService from "../services/registerationService";

import useAuthStore from "../store/useAuthStore.js";
import Pagination from "../components/Pagination";

const Events = () => {
  const { auth } = useAuthStore();

  const EVENTS_PER_PAGE = 6;
  const [events, setEvents] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all events
        const data = await eventService.getAllEvents(
          currentPage,
          EVENTS_PER_PAGE
        );

        const sortedEvents = [...data.events].sort((a, b) => {
          const now = new Date();

          const aOpen =
            now >= new Date(a.registrationStart) &&
            now <= new Date(a.registrationEnd);

          const bOpen =
            now >= new Date(b.registrationStart) &&
            now <= new Date(b.registrationEnd);

          // Open registrations first
          if (aOpen && !bOpen) return -1;
          if (!aOpen && bOpen) return 1;

          // Otherwise sort by event date
          return new Date(a.date) - new Date(b.date);
        });

        setEvents(sortedEvents);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);

        // Fetch student's registrations
        if (auth.role === "student") {
          const registrations =
            await registrationService.getMyRegistrations();

          const statuses = {};

          registrations.forEach((registration) => {
            if (!registration.event) return;

            statuses[registration.event._id] =
              registration.status;
          });

          setRegistrationStatus(statuses);
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
  }, [auth.role, currentPage]);

  useEffect(() => {
    const handleSeatUpdate = (data) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === data.eventId
            ? {
              ...event,
              availableSeats: data.availableSeats,
            }
            : event
        )
      );
    };

    socket.on("seatUpdated", handleSeatUpdate);

    return () => {
      socket.off("seatUpdated", handleSeatUpdate);
    };
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const data =
        await registrationService.registerForEvent(eventId);

      toast.success(data.message);

      // Only update the registration status.
      // Seat count will be updated by Socket.IO.
      setRegistrationStatus((prev) => ({
        ...prev,
        [eventId]: data.registration.status,
      }));
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

        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">

          <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="bg-white rounded-2xl shadow-md p-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Loading Events...
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while we fetch the latest events.
              </p>

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}

          <div className="mb-10">
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {events.length} Events
            </span>

          </div>

          {events.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <h2 className="text-2xl font-semibold text-gray-800">
                No Events Available
              </h2>

              <p className="text-gray-500 mt-3">
                New events will appear here once organizers publish them.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  role={auth.role}
                  registrationStatus={registrationStatus[event._id]}
                  onRegister={handleRegister}
                />
              ))}

            </div>

          )}

          {totalPages > 1 && (

            <div className="flex justify-center mt-12">

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

            </div>

          )}

        </div>

      </div>
    </>
  );
};

export default Events;