import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PencilSquare } from "../helpers/edit";
import { Trash } from "../helpers/trash";
import { Check } from "../helpers/check";
import { CheckFill } from "../helpers/checkFill";
import { Clipboard } from "../helpers/review";
import toast from "react-hot-toast";
import { fetchCashRecords, deleteCashRecord, startEditing, startReviewing, approveCashRecord } from "../store/features/cashSlice";
import TableSkeleton from "./ui/TableSkeleton";

export default function CashTableDetails({ searchQuery }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { records, loading, error } = useSelector((store) => store.cash);

  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;
  const highlightId = searchParams.get("highlight");
  const rowRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [serialToDelete, setSerialToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCashRecords());
  }, [dispatch]);

  useEffect(() => {
    if (loading || !highlightId) return;

    const id = Number(highlightId);
    if (!Number.isFinite(id)) return;

    const row = rowRefs.current[id];
    if (!row) return;

    row.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(id);

    const timeoutId = setTimeout(() => setHighlightedId(null), 3500);
    return () => clearTimeout(timeoutId);
  }, [loading, records, highlightId]);

  // Filter records (case-insensitive)
  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;
    return (
      Object.values(record)
        //Convert every value into a string safely.
        .map((v) => String(v || ""))
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const handleEditClick = (index, record) => {
    const serialNumber = index + 1;

    dispatch(startEditing({ index, record }));

    toast.success(`Ready to edit record ${serialNumber}`);

    navigate("/dashboard/revenue&cash/cash");
  }

  const handleReviewClick = (index, record) => {
      const serialNumber = index + 1;
  
      dispatch(startReviewing({ index, record }));
  
      toast.success(`Ready to review record ${serialNumber}`);
  
      navigate("/dashboard/revenue&cash/cash");
    };

  //DELETE
  const openDeleteModal = (record, index) => {
    setRecordToDelete(record);
    setSerialToDelete(index + 1); // or record.account_name
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
     try {
       await dispatch(deleteCashRecord(recordToDelete.id)).unwrap();
       toast.success("Record deleted successfully!");
       dispatch(fetchCashRecords());
     } catch (err) {
       toast.error(err || "Failed to delete record.");
     } finally {
       setIsDeleteModalOpen(false);
       setRecordToDelete(null);
     }
  }

  //approve
    const handleApprove = async (record) => {
      try {
        await dispatch(approveCashRecord(record.id)).unwrap();
        toast.success("Record approved successfully!");
        dispatch(fetchCashRecords());
      } catch (err) {
        toast.error(err || "Failed to approve record.");
      }
    };

  if (loading)
    return (
      <TableSkeleton
        headers={[
          "S.N",
          "Date",
          "Account Name",
          "Currency",
          "Balance",
          "Status",
          "Actions",
        ]}
      />
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full overflow-x-auto py-6">
      <table className="min-w-full shadow-lg bg-white">
        <thead className="bg-green-100 text-green-800 font-semibold">
          <tr>
            <th className="border px-2 py-1">S.N</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Account Name</th>
            <th className="border px-2 py-1">Currency</th>
            <th className="border px-2 py-1">Balance</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-4 italic">
                No data available
              </td>
            </tr>
          ) : (
            filteredRecords.map((record, index) => (
              <tr
                key={record.id || index}
                ref={(el) => {
                  if (record.id != null) rowRefs.current[record.id] = el;
                }}
                className={`text-center ${
                  highlightedId === record.id ? "bg-green-100" : ""
                }`}
              >
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{record?.as_at_date}</td>
                <td className="border px-2 py-1">{record.account_name}</td>
                <td className="border px-2 py-1">{record.currency}</td>
                <td className="border px-2 py-1">{record.balance}</td>
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
                                onClick={() => handleEditClick(index, record)}
                              className="text-yellow-600 font-semibold cursor-pointer"
                            >
                              <PencilSquare /> Edit
                            </a>
                          </li>

                          <li>
                            <span
                              onClick={() => openDeleteModal(record, index)}
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
                          <span
                            onClick={() => handleReviewClick(index, record)}
                            className="text-blue-700 font-semibold cursor-pointer"
                          >
                            <Clipboard /> Review
                          </span>
                        </li>
                      )}

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

      {/*      DELETE MODAL    */}

      {isDeleteModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-400">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete item{" "}
              <span className="font-semibold text-green-800">
                “{serialToDelete}”
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
  );
}
