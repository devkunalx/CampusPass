import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import UserTable from "../components/admin/UserTable";

import adminService from "../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const USERS_PER_PAGE = 10;

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers(
          currentPage,
          USERS_PER_PAGE
        );

        setUsers(data.users);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            "Failed to fetch users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      role === "" || user.role === role;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-2xl font-bold">
            Loading Users...
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Manage Users
            </h1>

            <p className="text-gray-500 mt-1">
              View all registered users.
            </p>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-4">

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              All Roles
            </option>

            <option value="student">
              Student
            </option>

            <option value="organizer">
              Organizer
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No users found.
            </h2>
          </div>
        ) : (
          <UserTable users={filteredUsers} />
        )}

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </>
  );
};

export default AdminUsers;