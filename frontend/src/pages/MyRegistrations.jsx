import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import RegistrationCard from "../components/RegistrationCard";

import registrationService from "../services/registerationService";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data =
          await registrationService.getMyRegistrations();

        setRegistrations(data);
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            "Failed to fetch registrations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleCancel = async (eventId) => {
    try {
      await registrationService.cancelRegistration(eventId);

      toast.success("Registration cancelled!");

      setRegistrations((prev) =>
        prev.filter(
          (registration) =>
            registration.event?._id !== eventId
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to cancel registration."
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">

          <div className="max-w-6xl mx-auto px-6 py-12">

            <div className="bg-white rounded-2xl shadow-md p-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Loading Registrations...
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while we fetch your registrations.
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}

          <div className="mb-10">

            <h1 className="text-4xl font-bold text-gray-800">
              My Registrations
            </h1>

            <p className="text-gray-600 mt-2">
              View all the events you've successfully registered for.
            </p>

          </div>

          {registrations.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <h2 className="text-2xl font-semibold text-gray-800">
                No Registrations Yet
              </h2>

              <p className="text-gray-500 mt-3">
                Register for an event and it will appear here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {registrations.map((registration) => (
                <RegistrationCard
                  key={registration._id}
                  registration={registration}
                  onCancel={handleCancel}
                />
              ))}

            </div>

          )}

        </div>

      </div>
    </>
  );
};

export default MyRegistrations;