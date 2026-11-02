import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  createLoadedData,
  deleteLoadedData,
  fetchAllLoadedData,
  updateLoadedData,
} from "../store/features/appropriationSlice";
import { Trash } from "../helpers/trash";
import { PencilSquare } from "../helpers/edit";
import Pagination from "./Pagination";
import TableSkeleton from "./ui/TableSkeleton";
import IconAction, { IconActionGroup } from "./ui/IconAction";

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

const primaryButton =
  "cursor-pointer rounded-lg bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532d] disabled:opacity-60 dark:bg-[#39FF88] dark:text-[#0B132B] dark:hover:bg-[#2eeb78]";

const TABLE_HEADERS = [
  "S.N",
  "Organization",
  "Economic Classification",
  "Source of Funding",
  "Natural Account",
  "Appropriation (GHS)",
  "Allotment (GHS)",
  "Date Created",
  "Actions",
];

const initialFormState = {
  organization: "",
  economicClassification: "",
  sourceOfFunding: "",
  naturalAccount: "",
  appropriation: "",
  allotment: "",
  year: "",
};

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function AppropriationSingleForm() {
  const dispatch = useDispatch();
  const { loading, error, records } = useSelector((state) => state.appropriation);
  const { authUser } = useSelector((state) => state.auth);
  const isAdmin = authUser?.role === "admin";

  const [form, setForm] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const recordList = Array.isArray(records) ? records : [];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      dispatch(updateLoadedData({ id: editingId, data: form }))
        .unwrap()
        .then(() => {
          toast.success("Data updated successfully!");
          clearForm();
        })
        .catch((err) => {
          toast.error(err || "Update failed");
        });
    } else {
      dispatch(createLoadedData(form))
        .unwrap()
        .then(() => {
          toast.success("Data saved successfully!");
          clearForm();
        })
        .catch((err) => {
          toast.error(err || "Create failed");
        });
    }
  };

  useEffect(() => {
    dispatch(fetchAllLoadedData());
  }, [dispatch]);

  const filteredRecords = recordList.filter((record) => {
    if (!searchQuery.trim()) return true;

    const search = searchQuery.toLowerCase();

    return (
      record.organization?.toLowerCase().includes(search) ||
      record.economicClassification?.toLowerCase().includes(search) ||
      record.sourceOfFunding?.toLowerCase().includes(search) ||
      record.naturalAccount?.toLowerCase().includes(search) ||
      String(record.appropriation)?.includes(search) ||
      String(record.allotment)?.includes(search)
    );
  });

  const PAGE_SIZE = 10;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [records, searchQuery]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      organization: row.organization,
      economicClassification: row.economicClassification,
      sourceOfFunding: row.sourceOfFunding,
      naturalAccount: row.naturalAccount,
      appropriation: row.appropriation,
      allotment: row.allotment,
      year: row.year,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (record, serialNumber) => {
    setRecordToDelete({ record, serialNumber });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteLoadedData(recordToDelete.record.id)).unwrap();
      toast.success("Record deleted successfully!");
      dispatch(fetchAllLoadedData());
    } catch (err) {
      toast.error(err || "Failed to delete record.");
    } finally {
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  if (error) {
    return (
      <p className="text-center text-red-500">
        {typeof error === "string" ? error : error.message}
      </p>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.05)] sm:p-6"
      >
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-base font-bold text-gray-900">
              {editingId ? "Edit budget line" : "New budget line"}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Organization, classification, and the amounts for the year.
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="cursor-pointer text-sm font-semibold text-green-800 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Organization">
            <input
              type="text"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter organization..."
            />
          </Field>
          <Field label="Economic classification">
            <input
              type="text"
              name="economicClassification"
              value={form.economicClassification}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter economic classification..."
            />
          </Field>
          <Field label="Source of funding">
            <input
              type="text"
              name="sourceOfFunding"
              value={form.sourceOfFunding}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter source of funding..."
            />
          </Field>
          <Field label="Natural account">
            <input
              type="text"
              name="naturalAccount"
              value={form.naturalAccount}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter natural account..."
            />
          </Field>
          <Field label="Appropriation">
            <input
              type="number"
              name="appropriation"
              value={form.appropriation}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter appropriation..."
            />
          </Field>
          <Field label="Allotment">
            <input
              type="number"
              name="allotment"
              value={form.allotment}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter allotment..."
            />
          </Field>
          <Field label="Year">
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter year..."
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? "Saving..." : editingId ? "Update" : "Save line"}
          </button>
        </div>
      </form>

      <div className="mb-4 mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search organization, classification, account or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {filteredRecords.length} of {recordList.length} lines
        </p>
      </div>

      {loading ? (
        <TableSkeleton headers={TABLE_HEADERS} />
      ) : (
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
                      : "No lines match your search."}
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((row, index) => (
                  <tr key={row.id} className="text-center">
                    <td className="px-3 py-3 font-semibold">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-3">{row.organization}</td>
                    <td className="px-3 py-3">{row.economicClassification}</td>
                    <td className="px-3 py-3">{row.sourceOfFunding}</td>
                    <td className="px-3 py-3">{row.naturalAccount}</td>
                    <td className="px-3 py-3">
                      {Number(row.appropriation).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      {Number(row.allotment).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(row.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {isAdmin && (
                        <IconActionGroup>
                          <IconAction
                            label="Edit"
                            tone="edit"
                            onClick={() => handleEdit(row)}
                          >
                            <PencilSquare />
                          </IconAction>
                          <IconAction
                            label="Delete"
                            tone="delete"
                            onClick={() =>
                              openDeleteModal(row, startIndex + index + 1)
                            }
                          >
                            <Trash />
                          </IconAction>
                        </IconActionGroup>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredRecords.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}

      {isDeleteModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold text-red-400">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete item{" "}
              <span className="font-semibold text-green-800">
                “{recordToDelete?.serialNumber}”
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
