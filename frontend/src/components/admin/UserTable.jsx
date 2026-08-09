const UserTable = ({ users }) => {
  return (
    <>
      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Role
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-gray-100 hover:bg-blue-50 transition"
              >

                <td className="px-6 py-5 font-medium text-gray-800">
                  {user.fullName}
                </td>

                <td className="px-6 py-5 text-gray-600">
                  {user.email}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "organizer"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-4">

        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-5"
          >

            <h3 className="font-semibold text-lg text-gray-800">
              {user.fullName}
            </h3>

            <p className="text-sm text-gray-500 mt-1 break-all">
              {user.email}
            </p>

            <div className="mt-4">

              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : user.role === "organizer"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role}
              </span>

            </div>

          </div>
        ))}

      </div>
    </>
  );
};

export default UserTable;