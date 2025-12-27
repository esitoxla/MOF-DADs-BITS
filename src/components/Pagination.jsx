import React from 'react'

export default function Pagination({ currentPage, totalItems, pageSize = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4 px-4">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page Info */}
      <span className="text-sm font-medium text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
