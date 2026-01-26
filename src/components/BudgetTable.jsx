import React, { useState, useEffect } from "react";
import { PencilSquare } from "../helpers/edit";
import { Trash } from "../helpers/trash";
import { Check } from "../helpers/check";
import { CheckFill } from "../helpers/checkFill";
import { Clipboard } from "../helpers/review";
import toast from "react-hot-toast";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  startEditing,
  startReviewing,
  fetchExpenditures,
  deleteExpenditure,
  approveExpenditure,
} from "../store/features/budgetSlice";

export default function BudgetTable({
  searchQuery,
  onEdit,
  setRecordToReview,
  setIsReviewModalOpen,
}) {
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector((store) => store.budget);
  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Filter records (case-insensitive)
  const filteredRecords = records.filter((record) =>
    Object.values(record)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  /* =========================
       PAGINATION
    ========================== */
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const index = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = filteredRecords.slice(index, index + PAGE_SIZE);

  useEffect(() => {
    dispatch(fetchExpenditures());
  }, [dispatch]);

  if (loading) return <p className="text-center py-4">Loading records...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  //delete
  const openDeleteModal = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteExpenditure(recordToDelete.id)).unwrap();
      toast.success("Record deleted successfully!");
      dispatch(fetchExpenditures());
    } catch (err) {
      toast.error(err || "Failed to delete record.");
    } finally {
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  ///review
  const handleReviewClick = (record, index) => {
    // Set reviewing mode and populate the form in the main page
    dispatch(startReviewing({ index, record }));
    onEdit(record);
    toast.success(`You are now reviewing "${record.activity}"`);
  };

  //approve
  const handleApprove = async (record) => {
    try {
      await dispatch(approveExpenditure(record.id)).unwrap();
      toast.success("Record approved successfully!");
      dispatch(fetchExpenditures());
    } catch (err) {
      toast.error(err || "Failed to approve record.");
    }
  };

  //
  const handleEditClick = (record, index) => {
    dispatch(startEditing({ index, record }));
    onEdit(record);
  };

  return (
    <>
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
              <th className="border px-2 py-1">Actual Expenditure</th>
              <th className="border px-2 py-1">Actual Payment</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan="15"
                  className="text-center text-gray-500 py-3 italic"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => (
                <tr key={record.id || index} className="text-center">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{record.activity}</td>
                  <td className="border px-2 py-1">{record.date}</td>
                  <td className="border px-2 py-1">
                    {record.economicClassification}
                  </td>
                  <td className="border px-2 py-1">{record.sourceOfFunding}</td>
                  <td className="border px-2 py-1">{record.naturalAccount}</td>
                  <td className="border px-2 py-1">{record.description}</td>
                  <td className="border px-2 py-1">{record.appropriation}</td>
                  <td className="border px-2 py-1">{record.allotment}</td>
                  <td className="border px-2 py-1">
                    {record.allotmentBalance}
                  </td>
                  <td className="border px-2 py-1">{record.releases}</td>
                  <td className="border px-2 py-1">
                    {record.actualExpenditure}
                  </td>
                  <td className="border px-2 py-1">{record.actualPayment}</td>
                  <td className="border px-2 py-1 font-semibold text-blue-900 border-black">
                    {record.status}
                  </td>

                  <td className="px-2 py-1 border text-center">
                    <ul className="menu bg-base-100 w-32 z-10">
                      {/* === DATA ENTRY USER === */}
                      {(userRole === "data_entry" || userRole === "admin") &&
                        record.status === "Pending" && (
                          <>
                            <li>
                              <a
                                onClick={() => handleEditClick(record, index)}
                                className="text-yellow-600 font-semibold cursor-pointer"
                              >
                                <PencilSquare /> Edit
                              </a>
                            </li>

                            <li>
                              <span
                                onClick={() => openDeleteModal(record)}
                                className="text-red-600 font-semibold cursor-pointer"
                              >
                                <Trash /> Delete
                              </span>
                            </li>
                          </>
                        )}

                      {/* === REVIEWER === */}
                      {(userRole === "reviewer" || userRole === "admin") &&
                        record.status === "Pending" && (
                          <li>
                            <a
                              onClick={() => {
                                // Set Redux to reviewing mode and populate the form
                                dispatch(startReviewing({ record, index }));
                                onEdit(record);

                                // Notify the reviewer
                                toast.success(
                                  `Ready to review "${record.activity}"`
                                );
                              }}
                              className="text-blue-700 font-semibold cursor-pointer"
                            >
                              <Clipboard /> Review
                            </a>
                          </li>
                        )}

                      {/* === APPROVER === */}
                      {(userRole === "approver" || userRole === "admin") &&
                        record.status === "Reviewed" && (
                          <li>
                            <a
                              onClick={() => handleApprove(record)}
                              className="text-green-800 font-semibold cursor-pointer"
                            >
                              <Check /> Approve
                            </a>
                          </li>
                        )}

                      {record.status === "Approved" && (
                        <li>
                          <a className="text-green-800 font-semibold cursor-pointer">
                            <CheckFill /> Approved
                          </a>
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/*                              DELETE MODAL                                  */}

        {isDeleteModalOpen && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-red-400">Confirm Delete</h3>
              <p className="py-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-green-800">
                  “{recordToDelete?.activity}”
                </span>
                ?
              </p>
              <div className="modal-action">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-outline"
                >
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
              <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
            </form>
          </dialog>
        )}
      </div>
      {/* Pagination (EXTERNAL COMPONENT) */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredRecords.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
