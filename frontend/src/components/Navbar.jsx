import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const Navbar = () => {
  const navigate = useNavigate();

  const { auth, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}

        <Link
          to="/dashboard"
          className="text-2xl font-bold text-blue-600"
        >
          CampusPass
        </Link>

        {/* Navigation Links */}

        <div className="flex items-center gap-8">

          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/events"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Events
          </Link>

          {/* User Info */}

          <div className="text-right">

            <p className="font-semibold">
              {auth?.fullName}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {auth?.role}
            </p>

          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;