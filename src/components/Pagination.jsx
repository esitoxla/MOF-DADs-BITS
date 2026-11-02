const pageButtonClass =
  "cursor-pointer rounded-lg border border-[#166534] bg-white px-4 py-2 text-sm font-medium text-[#166534] transition-colors hover:bg-[#e8f6ee] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-white disabled:text-gray-400 disabled:hover:bg-white dark:border-[#39FF88] dark:bg-transparent dark:text-[#39FF88] dark:hover:bg-[rgba(57,255,136,0.12)] dark:disabled:border-white/20 dark:disabled:bg-transparent dark:disabled:text-[#8b9bb0] dark:disabled:hover:bg-transparent";

export default function Pagination({ currentPage, totalItems, pageSize = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="mb-8 mt-4 flex items-center justify-between px-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={pageButtonClass}
      >
        Previous
      </button>

      <span className="text-sm font-medium text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={pageButtonClass}
      >
        Next
      </button>
    </div>
  );
}
