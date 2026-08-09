const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 &&
        i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== "..."
    ) {
      pages.push("...");
    }
  }

  return (
    <div className="flex justify-center mt-12">

      <div className="flex flex-wrap justify-center items-center gap-2 bg-white rounded-2xl shadow-md border border-gray-200 px-4 py-3">

        {/* Previous */}

        <button
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="px-2 text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl font-semibold transition ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-500"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}

        <button
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>

      </div>

    </div>
  );
};

export default Pagination;