import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import OrganizerEventCard from "../components/OrganizerEventCard";
import Pagination from "../components/Pagination";

import organizerServices from "../services/organizerServices";

const EVENTS_PER_PAGE = 6;

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true);

        const data =
          await organizerServices.getMyEvents();

        setEvents(data.events || []);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            "Failed to fetch your events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [currentPage]);

  const removeEvent = (eventId) => {
    const updatedEvents = events.filter(
      (event) => event._id !== eventId
    );

    setEvents(updatedEvents);

    if (
      updatedEvents.length === 0 &&
      currentPage > 1
    ) {
      setCurrentPage((prev) => prev - 1);
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
                Loading Your Events...
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while we fetch your
                events.
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

          <div className="flex justify-between items-center mb-10">

            <div>

              <h1 className="text-4xl font-bold text-gray-800">
                My Events
              </h1>

              <p className="text-gray-600 mt-2">
                Manage your events and monitor
                registrations.
              </p>

            </div>

            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {events.length} Events
            </span>

          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <h2 className="text-2xl font-semibold text-gray-800">
                No Events Yet
              </h2>

              <p className="text-gray-500 mt-3">
                You haven't created any events.
                Create your first campus event to
                get started.
              </p>

            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {events.map((event) => (
                  <OrganizerEventCard
                    key={event._id}
                    event={event}
                    removeEvent={removeEvent}
                  />
                ))}

              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />

                </div>
              )}
            </>
          )}

        </div>

      </div>
    </>
  );
};

export default MyEvents;