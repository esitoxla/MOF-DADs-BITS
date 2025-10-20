import React from "react";
import { PencilSquare } from "../helpers/edit";
import { Trash } from "../helpers/trash";
import { Check } from "../helpers/check";
import { Clipboard } from "../helpers/review";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { startEditing } from "../store/features/budgetSlice";

export default function BudgetTable({
  records,
  setRecords,
  searchQuery,
  onEdit,
}) {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  if (records.length === 0) return null; // don’t render if no data

  // Filter logic (case-insensitive, matches any field)
  const filteredRecords = records.filter((record) =>
    Object.values(record)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  //delete logic
  const openDeleteModal = (index) => {
    setRecordToDelete(index);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedRecords = records.filter((_, i) => i !== recordToDelete);
    setRecords(updatedRecords);
    setIsModalOpen(false);
    toast.success("Record deleted successfully!");
    setRecordToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };

  //handling the edit functionality
  const handleEditClick = (record, index) => {
    dispatch(startEditing({ index, record }));
    onEdit(record); // tells BudgetExpenditure to fill the form fields
  };

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
            <th className="border px-2 py-1">Actions</th>
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
                  <ul className=" menu bg-base-100 w-32 z-10">
                    <li>
                      <a
                        onClick={() => handleEditClick(record, index)}
                        className="text-yellow-600 font-semibold"
                      >
                        <PencilSquare />
                        Edit
                      </a>
                    </li>
                    <li>
                      <a className="text-blue-700 font-semibold">
                        <Clipboard /> Review
                      </a>
                    </li>
                    <li>
                      <a className="text-green-800 font-semibold">
                        <Check />
                        Approve
                      </a>
                    </li>
                    <li>
                      <span
                        onClick={() => openDeleteModal(index)}
                        className="text-red-600 font-semibold"
                      >
                        <Trash />
                        Delete
                      </span>
                    </li>
                  </ul>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*  DaisyUI Modal (renders outside the table to avoid layering issues) */}
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-400">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete
              <span className="font-semibold text-green-800">
                “{records[recordToDelete]?.activity}”
              </span>
              ?
            </p>
            <div className="modal-action">
              <button onClick={closeModal} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
