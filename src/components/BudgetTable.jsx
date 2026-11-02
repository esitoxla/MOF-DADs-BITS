import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { PencilSquare } from "../helpers/edit";
import { Trash } from "../helpers/trash";
import { Check } from "../helpers/check";
import { CheckFill } from "../helpers/checkFill";
import { Clipboard } from "../helpers/review";
import { refreshNotifications } from "./NotificationBell";
import Pagination from "./Pagination";
import TableSkeleton from "./ui/TableSkeleton";
import StatusBadge from "./ui/StatusBadge";
import IconAction, { IconActionGroup } from "./ui/IconAction";
import {
  approveExpenditure,
  deleteExpenditure,
  fetchExpenditures,
  startEditing,
  startReviewing,
} from "../store/features/budgetSlice";

const PAGE_SIZE = 10;

const TABLE_HEADERS = [
  "S.N",
  "Activity",
  "Date",
  "Economic Class",
  "Funding Source",
  "Natural Account",
  "Description",
  "Appropriation",
  "Allotment",
  "Allotment Balance",
  "Appropriation Balance",
  "Releases",
  "Actual Expenditure",
  "Actual Payment",
  "Status",
  "Actions",
];

export function filterExpenditureRecords(
  records = [],
  {
    searchQuery = "",
    economicClassFilter = "",
    fundingFilter = "",
    statusFilter = "",
  } = {},
) {
  const query = searchQuery.trim().toLowerCase();
  const list = Array.isArray(records) ? records : [];

  return list.filter((record) => {
    if (
      economicClassFilter &&
      record.economicClassification !== economicClassFilter
    ) {
      return false;
    }
    if (fundingFilter && record.sourceOfFunding !== fundingFilter) return false;
    if (statusFilter && record.status !== statusFilter) return false;
    if (!query) return true;

    return Object.values(record)
      .map((value) => String(value ?? ""))
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export default function BudgetTable({
  searchQuery = "",
  economicClassFilter = "",
  fundingFilter = "",
  statusFilter = "",
  onOpenForm,
}) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { records, loading, error } = useSelector((store) => store.budget);
  const { authUser } = useSelector((state) => state.auth);

  const userRole = authUser?.role;
  const highlightId = searchParams.get("highlight");
  const rowRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [serialToDelete, setSerialToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = filterExpenditureRecords(records, {
    searchQuery,
    economicClassFilter,
    fundingFilter,
    statusFilter,
  });
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = filteredRecords.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const filtersKey = `${searchQuery}|${economicClassFilter}|${fundingFilter}|${statusFilter}`;
  const previousFilters = useRef(filtersKey);

  useEffect(() => {
    dispatch(fetchExpenditures());
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

  if (loading) return <TableSkeleton headers={TABLE_HEADERS} />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleApprove = async (record) => {
    try {
      await dispatch(approveExpenditure(record.id)).unwrap();
      toast.success("Record approved successfully!");
      dispatch(fetchExpenditures());
      refreshNotifications();
    } catch (err) {
      toast.error(err || "Failed to approve record.");
    }
  };

  const openDeleteModal = (record, index) => {
    setRecordToDelete(record);
    setSerialToDelete(index + 1);
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

  const recordList = Array.isArray(records) ? records : [];

  return (
    <>
      <div className="w-full">
        <div className="data-table-wrap">
          <table className="data-table data-table-strong min-w-full">
            <thead>
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header} className="px-3 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="py-4 text-center italic text-gray-500"
                  >
                    {recordList.length === 0
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
                      <td className="px-3 py-3">{record.activity}</td>
                      <td className="px-3 py-3">{record.date}</td>
                      <td className="px-3 py-3">
                        {record.economicClassification}
                      </td>
                      <td className="px-3 py-3">{record.sourceOfFunding}</td>
                      <td className="px-3 py-3">{record.naturalAccount}</td>
                      <td className="px-3 py-3">{record.description}</td>
                      <td className="px-3 py-3">{record.appropriation}</td>
                      <td className="px-3 py-3">{record.allotment}</td>
                      <td className="px-3 py-3">{record.allotmentBalance}</td>
                      <td className="px-3 py-3">
                        {record.appropriationBalance}
                      </td>
                      <td className="px-3 py-3">{record.releases}</td>
                      <td className="px-3 py-3">{record.actualExpenditure}</td>
                      <td className="px-3 py-3">{record.actualPayment}</td>
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
              <h3 className="text-lg font-bold text-red-400">Confirm Delete</h3>
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
