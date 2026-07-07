import Navbar from "../components/Navbar";
import useAuthStore from "../store/useAuthStore.js";

const Dashboard = () => {
  const { auth } = useAuthStore();

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 px-6">

        <h1 className="text-4xl font-bold">
          Welcome, {auth.fullName} 👋
        </h1>

        <p className="text-gray-600 mt-2">
          Email: {auth.email}
        </p>

        <p className="text-gray-600">
          Role: {auth.role}
        </p>

      </div>
    </>
  );
};

export default Dashboard;