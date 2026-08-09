import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";

import adminService from "../services/adminService";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const EVENTS_PER_PAGE = 6;

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const data = await adminService.getEvents(
        currentPage,
        EVENTS_PER_PAGE
      );

      setEvents(data.events);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to fetch events."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await adminService.deleteEvent(eventId);

      toast.success("Event deleted successfully.");

      const updatedEvents = events.filter(
        (event) => event._id !== eventId
      );

      setEvents(updatedEvents);

      if (
        updatedEvents.length === 0 &&
        currentPage > 1
      ) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchEvents();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to delete event."
      );
    }
  };

  const filteredEvents = events.filter((event) => {
    const query = search.toLowerCase();

    return (
      event.title.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">

          <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="bg-white rounded-2xl shadow-md p-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Loading Events...
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while events are being loaded.
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

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

            <div>

              <h1 className="text-4xl font-bold text-gray-800">
                Manage Events
              </h1>

              <p className="text-gray-600 mt-2">
                View, search and manage all campus events.
              </p>

            </div>

            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold w-fit">
              {events.length} Events
            </div>

          </div>

          {/* Search */}

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">

            <input
              type="text"
              placeholder="Search by title, category or venue..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />

          </div>

          {/* Events */}

          {filteredEvents.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <h2 className="text-2xl font-semibold text-gray-800">
                No events found
              </h2>

              <p className="text-gray-500 mt-3">
                Try changing your search keywords.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  role="admin"
                  onDelete={handleDelete}
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

export default AdminEvents;