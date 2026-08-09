const DashboardCard = ({
  title,
  value,
  icon,
  color = "blue",
}) => {
  const colors = {
    blue: {
      bg: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-500",
      light: "bg-green-50",
      text: "text-green-600",
    },
    red: {
      bg: "bg-red-500",
      light: "bg-red-50",
      text: "text-red-600",
    },
    yellow: {
      bg: "bg-yellow-500",
      light: "bg-yellow-50",
      text: "text-yellow-600",
    },
    purple: {
      bg: "bg-purple-500",
      light: "bg-purple-50",
      text: "text-purple-600",
    },
    indigo: {
      bg: "bg-indigo-500",
      light: "bg-indigo-50",
      text: "text-indigo-600",
    },
  };

  const theme = colors[color] || colors.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Top Accent */}

      <div className={`h-1 ${theme.bg}`} />

      <div className="p-6 flex justify-between items-center">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl ${theme.light} ${theme.text} flex items-center justify-center text-3xl`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default DashboardCard;