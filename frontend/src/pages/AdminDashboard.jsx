import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import DashboardCard from "../components/admin/DashboardCard";

import adminService from "../services/adminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminService.getDashboard();

        setDashboard(data);
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">

          <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="bg-white rounded-2xl shadow-md p-8">

              <h2 className="text-3xl font-bold text-gray-800">
                Loading Dashboard...
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while we load your dashboard.
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

            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Monitor users, events and registrations across CampusPass.
            </p>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

            <DashboardCard
              title="Total Users"
              value={dashboard.totalUsers}
              icon="👥"
              color="blue"
            />

            <DashboardCard
              title="Students"
              value={dashboard.students}
              icon="🎓"
              color="green"
            />

            <DashboardCard
              title="Organizers"
              value={dashboard.organizers}
              icon="🧑‍💼"
              color="yellow"
            />

            <DashboardCard
              title="Admins"
              value={dashboard.admins}
              icon="🛡️"
              color="red"
            />

            <DashboardCard
              title="Events"
              value={dashboard.totalEvents}
              icon="📅"
              color="purple"
            />

            <DashboardCard
              title="Registrations"
              value={dashboard.totalRegistrations}
              icon="🎟️"
              color="indigo"
            />

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminDashboard;