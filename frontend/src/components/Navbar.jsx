import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const Navbar = () => {
  const navigate = useNavigate();

  const { auth, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = {
    student: [
      {
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        label: "Events",
        path: "/events",
      },
      {
        label: "My Registrations",
        path: "/my-registrations",
      },
    ],

    organizer: [
      {
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        label: "Events",
        path: "/events",
      },
      {
        label: "Create Event",
        path: "/create-event",
      },
      {
        label: "My Events",
        path: "/my-events",
      },
    ],

    admin: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
      },
      {
        label: "Users",
        path: "/admin/users",
      },
      {
        label: "Events",
        path: "/admin/events",
      },
    ],
  };

  const dashboardPath =
    auth?.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}

          <Link
            to={dashboardPath}
            className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition"
          >
            CampusPass
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden md:flex items-center gap-2">

            {(navItems[auth?.role] || []).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

          </div>

          {/* Desktop Right */}

          <div className="hidden md:flex items-center gap-4">

            <div className="text-right">

              <p className="font-semibold text-gray-800">
                {auth?.fullName}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                {auth?.role}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              Logout
            </button>

          </div>

          {/* Mobile Button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-gray-700"
          >
            ☰
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="md:hidden border-t bg-white">

          <div className="px-4 py-4 space-y-2">

            {(navItems[auth?.role] || []).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="border-t pt-4 mt-4">

              <p className="font-semibold">
                {auth?.fullName}
              </p>

              <p className="text-sm text-gray-500 capitalize mb-4">
                {auth?.role}
              </p>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;