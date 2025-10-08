import React from "react";

export default function BudgetPerformanceTable({ data, selectedFunding }) {
  // Helper to determine whether to show a column
  const showColumn = (fundingType) => {
    return selectedFunding === "All" || selectedFunding === fundingType;
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
        Summary of Budget Performance
      </h2>

      <table className="min-w-full border border-gray-300 text-sm sm:text-base text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left w-1/4">
              EXPENDITURE ITEM
            </th>

            {/* Conditionally show funding columns */}
            {showColumn("GOG") && (
              <th className="border border-gray-300 px-4 py-2 text-center">
                GOG
              </th>
            )}
            {showColumn("IGF") && (
              <th className="border border-gray-300 px-4 py-2 text-center">
                IGF
              </th>
            )}
            {showColumn("DPF") && (
              <th className="border border-gray-300 px-4 py-2 text-center">
                DPF
              </th>
            )}

            {/* Always show Total */}
            <th className="border border-gray-300 px-4 py-2 text-center">
              TOTAL
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => {
            // Determine total value dynamically
            const total =
              selectedFunding === "All"
                ? row.total
                : row[selectedFunding.toLowerCase()] || 0;

            return (
              <tr
                key={idx}
                className={`text-center ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="border border-gray-300 px-4 py-2 text-left font-medium">
                  {row.item}
                </td>

                {showColumn("GOG") && (
                  <td className="border border-gray-300 px-4 py-2">
                    {row.gog.toLocaleString()}
                  </td>
                )}
                {showColumn("IGF") && (
                  <td className="border border-gray-300 px-4 py-2">
                    {row.igf.toLocaleString()}
                  </td>
                )}
                {showColumn("DPF") && (
                  <td className="border border-gray-300 px-4 py-2">
                    {row.dpf.toLocaleString()}
                  </td>
                )}

                <td className="border border-gray-300 px-4 py-2 font-semibold text-green-700">
                  {total.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
