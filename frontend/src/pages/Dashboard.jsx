import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import useAuthStore from "../store/useAuthStore.js";

const Dashboard = () => {
  const { auth } = useAuthStore();

  const studentCards = [
    {
      title: "Browse Events",
      description:
        "Explore upcoming events happening on campus.",
      link: "/events",
      button: "View Events",
      color: "bg-blue-600",
    },
    {
      title: "My Registrations",
      description:
        "Check all the events you've registered for.",
      link: "/my-registrations",
      button: "View Registrations",
      color: "bg-green-600",
    },
  ];

  const organizerCards = [
    {
      title: "Create Event",
      description:
        "Publish a new event for students.",
      link: "/create-event",
      button: "Create",
      color: "bg-blue-600",
    },
    {
      title: "Manage Events",
      description:
        "Edit, update or monitor your events.",
      link: "/my-events",
      button: "Manage",
      color: "bg-purple-600",
    },
    {
      title: "Browse Events",
      description:
        "View all events on CampusPass.",
      link: "/events",
      button: "View",
      color: "bg-green-600",
    },
  ];

  const cards =
    auth.role === "student"
      ? studentCards
      : organizerCards;

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-blue-50 via-white to-slate-100">

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Welcome Card */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

            <h1 className="text-4xl font-extrabold text-gray-800">
              Welcome, {auth.fullName} 
            </h1>

            <p className="mt-3 text-gray-600">
              Glad to see you back on CampusPass.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4 border">

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold break-all">
                  {auth.email}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4 border">

                <p className="text-sm text-gray-500">
                  Role
                </p>

                <p className="font-semibold capitalize">
                  {auth.role}
                </p>

              </div>

            </div>

          </div>

          {/* Quick Actions */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between"
                >

                  <div>

                    <h3 className="text-xl font-bold mb-2">
                      {card.title}
                    </h3>

                    <p className="text-gray-600">
                      {card.description}
                    </p>

                  </div>

                  <Link
                    to={card.link}
                    className={`${card.color} mt-6 inline-block text-center text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200`}
                  >
                    {card.button}
                  </Link>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Dashboard;