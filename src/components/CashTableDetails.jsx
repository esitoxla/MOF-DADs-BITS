import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { PencilSquare } from "../helpers/edit";
import { Trash } from "../helpers/trash";
import { Check } from "../helpers/check";
import { CheckFill } from "../helpers/checkFill";
import { Clipboard } from "../helpers/review";
import { refreshNotifications } from "./NotificationBell";
import toast from "react-hot-toast";
import Pagination from "./Pagination";
import {
  fetchCashRecords,
  deleteCashRecord,
  startEditing,
  startReviewing,
  approveCashRecord,
} from "../store/features/cashSlice";
import TableSkeleton from "./ui/TableSkeleton";
import StatusBadge from "./ui/StatusBadge";
import IconAction, { IconActionGroup } from "./ui/IconAction";

const PAGE_SIZE = 10;

export function filterCashRecords(
  records = [],
  {
    searchQuery = "",
    accountFilter = "",
    currencyFilter = "",
    statusFilter = "",
  } = {},
) {
  const query = searchQuery.trim().toLowerCase();
  const list = Array.isArray(records) ? records : [];

  return list.filter((record) => {
    if (accountFilter && record.account_name !== accountFilter) return false;
    if (currencyFilter && record.currency !== currencyFilter) return false;
    if (statusFilter && record.status !== statusFilter) return false;
    if (!query) return true;

    return Object.values(record)
      .map((value) => String(value ?? ""))
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export default function CashTableDetails({
  searchQuery = "",
  accountFilter = "",
  currencyFilter = "",
  statusFilter = "",
  onOpenForm,
}) {
  const dispatch = useDispatch();
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
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = filterCashRecords(records, {
    searchQuery,
    accountFilter,
    currencyFilter,
    statusFilter,
  });
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = filteredRecords.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const filtersKey = `${searchQuery}|${accountFilter}|${currencyFilter}|${statusFilter}`;
  const previousFilters = useRef(filtersKey);

  useEffect(() => {
    dispatch(fetchCashRecords());
  }, [dispatch]);

  useEffect(() => {
    if (previousFilters.current === filtersKey) return;
    previousFilters.current = filtersKey;
    setCurrentPage(1);
  }, [filtersKey]);

  useEffect(() => {
    if (loading || !highlightId) return;

    const id = Number(highlightId);
    if (!Number.isFinite(id)) return;

    const recordIndex = filteredRecords.findIndex(
      (record) => Number(record.id) === id,
    );
    if (recordIndex === -1) return;

    const page = Math.floor(recordIndex / PAGE_SIZE) + 1;
    if (page !== currentPage) {
      setCurrentPage(page);
      return;
    }

    const row = rowRefs.current[id];
    if (!row) return;

    row.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(id);

    const timeoutId = setTimeout(() => setHighlightedId(null), 3500);
    return () => clearTimeout(timeoutId);
  }, [loading, records, highlightId, currentPage, filtersKey]);

  const openRecordForm = (index, record, mode) => {
    const serialNumber = index + 1;

    if (mode === "review") {
      dispatch(startReviewing({ index, record }));
      toast.success(`Ready to review record ${serialNumber}`);
    } else {
      dispatch(startEditing({ index, record }));
      toast.success(`Ready to edit record ${serialNumber}`);
    }

    onOpenForm?.();
  };

  const openDeleteModal = (record, index) => {
    setRecordToDelete(record);
    setSerialToDelete(index + 1);
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
  };

  const handleApprove = async (record) => {
    try {
      await dispatch(approveCashRecord(record.id)).unwrap();
      toast.success("Record approved successfully!");
      dispatch(fetchCashRecords());
      refreshNotifications();
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
    <>
      <div className="w-full">
        <div className="data-table-wrap">
          <table className="data-table data-table-strong min-w-full">
            <thead>
              <tr>
                <th className="px-3 py-3">S.N</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Account Name</th>
                <th className="px-3 py-3">Currency</th>
                <th className="px-3 py-3">Balance</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-4 italic"
                  >
                    {records.length === 0
                      ? "No data available"
                      : "No records match your search or filters."}
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => {
                  const serialNumber = pageStart + index + 1;
                  return (
                    <tr
                      key={record.id || index}
                      ref={(el) => {
                        if (record.id != null) rowRefs.current[record.id] = el;
                      }}
                      className={`text-center ${
                        highlightedId === record.id ? "bg-green-100" : ""
                      }`}
                    >
                      <td className="px-3 py-3">{serialNumber}</td>
                      <td className="px-3 py-3">{record?.as_at_date}</td>
                      <td className="px-3 py-3">{record.account_name}</td>
                      <td className="px-3 py-3">{record.currency}</td>
                      <td className="px-3 py-3">{record.balance}</td>
                      <td className="bg-transparent px-3 py-3">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <IconActionGroup colored>
                          {(userRole === "data_entry" ||
                            userRole === "admin") &&
                            record.status === "Pending" && (
                              <>
                                <IconAction
                                  label="Edit"
                                  tone="edit"
                                  onClick={() =>
                                    openRecordForm(
                                      serialNumber - 1,
                                      record,
                                      "edit",
                                    )
                                  }
                                >
                                  <PencilSquare />
                                </IconAction>
                                <IconAction
                                  label="Delete"
                                  tone="delete"
                                  onClick={() =>
                                    openDeleteModal(record, serialNumber - 1)
                                  }
                                >
                                  <Trash />
                                </IconAction>
                              </>
                            )}

                          {(userRole === "reviewer" || userRole === "admin") &&
                            record.status === "Pending" && (
                              <IconAction
                                label="Review"
                                tone="review"
                                onClick={() =>
                                  openRecordForm(
                                    serialNumber - 1,
                                    record,
                                    "review",
                                  )
                                }
                              >
                                <Clipboard />
                              </IconAction>
                            )}

                          {(userRole === "approver" || userRole === "admin") &&
                            record.status === "Reviewed" && (
                              <IconAction
                                label="Approve"
                                tone="approve"
                                onClick={() => handleApprove(record)}
                              >
                                <Check />
                              </IconAction>
                            )}

                          {record.status === "Approved" && (
                            <IconAction label="Approved" tone="done">
                              <CheckFill />
                            </IconAction>
                          )}
                        </IconActionGroup>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
      <Pagination
        currentPage={currentPage}
        totalItems={filteredRecords.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
