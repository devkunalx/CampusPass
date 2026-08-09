import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import RegistrationCard from "../components/RegistrationCard";

import organizerServices from "../services/organizerServices.js";

const EventRegistrations = () => {
  const { id } = useParams();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await organizerServices.getEventRegistrations(id);

        setRegistrations(data?.registrations || []);
        setTotalRegistrations(data?.total || 0);

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
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="max-w-6xl mx-auto mt-10">
          <h2 className="text-2xl font-bold">
            Loading Registrations...
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          Event Registrations
        </h1>

        <p className="text-gray-600 mb-6">
          Total Registrations: {totalRegistrations}
        </p>

        {registrations.length === 0 ? (
          <div className="text-center mt-20">

            <h2 className="text-2xl font-semibold">
              No registrations yet.
            </h2>

            <p className="text-gray-500 mt-2">
              Students haven't registered for this event.
            </p>

          </div>
        ) : (
          <div className="grid gap-5">

            {registrations.map((registration) => (
              <RegistrationCard
                key={registration._id}
                registration={registration}
              />
            ))}

          </div>
        )}

      </div>
    </>
  );
};

export default EventRegistrations;