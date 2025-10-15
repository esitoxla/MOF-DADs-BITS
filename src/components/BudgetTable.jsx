import React from "react";

export default function BudgetTable({ records, searchQuery }) {
  if (records.length === 0) return null; // don’t render if no data

  // Filter logic (case-insensitive, matches any field)
  const filteredRecords = records.filter((record) =>
    Object.values(record)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full overflow-x-auto lg:px-4">
      <table className="min-w-full shadow-lg bg-white">
        <thead className="bg-green-100 text-green-800 font-semibold">
          <tr>
            <th className="border px-2 py-1">S.N</th>
            <th className="border px-2 py-1">Activity</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Economic Class</th>
            <th className="border px-2 py-1">Funding Source</th>
            <th className="border px-2 py-1">Natural Account</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Appropriation</th>
            <th className="border px-2 py-1">Allotment</th>
            <th className="border px-2 py-1">Allotment Balance</th>
            <th className="border px-2 py-1">Releases</th>
            <th className="border px-2 py-1">Expenditure</th>
            <th className="border px-2 py-1">Payment</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            // Case 1: No records have been submitted yet
            <tr>
              <td
                colSpan="13"
                className="text-center text-gray-500 py-3 italic"
              >
                No inputs yet. Please submit a record.
              </td>
            </tr>
          ) : filteredRecords.length === 0 ? (
            // Case 2: Records exist, but no match for search
            <tr>
              <td
                colSpan="13"
                className="text-center text-gray-500 py-3 italic"
              >
                No matching records found.
              </td>
            </tr>
          ) : (
            // Case 3: Display filtered records
            filteredRecords.map((record, index) => (
              <tr key={index} className="text-center">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{record.activity}</td>
                <td className="border px-2 py-1">{record.date}</td>
                <td className="border px-2 py-1">{record.economicClass}</td>
                <td className="border px-2 py-1">{record.fundingSource}</td>
                <td className="border px-2 py-1">{record.naturalAccount}</td>
                <td className="border px-2 py-1">{record.description}</td>
                <td className="border px-2 py-1">{record.appropriation}</td>
                <td className="border px-2 py-1">{record.allotment}</td>
                <td className="border px-2 py-1">{record.allotmentBalance}</td>
                <td className="border px-2 py-1">{record.releases}</td>
                <td className="border px-2 py-1">{record.expenditure}</td>
                <td className="border px-2 py-1">{record.payment}</td>
               {/* --- Actions Menu (DaisyUI) --- */}
<td className="px-2 py-1 border text-center">
  <div className="dropdown dropdown-end">
    <div
      tabIndex={0}
      role="button"
      className="btn btn-ghost btn-sm"
    >
      •••
    </div>

    <ul
      tabIndex={0}
      className="dropdown-content menu shadow bg-base-100 rounded-box w-32 z-10"
    >
      <li><a>Edit</a></li>
      <li><a>Review</a></li>
      <li><a>Approve</a></li>
      <li><a className="text-red-600">Delete</a></li>
    </ul>
  </div>
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
