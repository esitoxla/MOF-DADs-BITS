import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLoadedData,
  deleteLoadedData,
  fetchAllLoadedData,
  updateLoadedData,
} from "../store/features/appropriationSlice";
import toast from "react-hot-toast";
import { Trash } from "../helpers/trash";
import { PencilSquare } from "../helpers/edit";
import { Search } from "lucide-react";
import Pagination from "./Pagination";
import TableSkeleton from "./ui/TableSkeleton";
import { useEffect } from "react";

export default function AppropriationSingleForm() {
  const dispatch = useDispatch();
  const { loading, error, uploadResponse, records } = useSelector(
    (state) => state.appropriation
  );

  //ADMIN CHECKS
  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;
  const isAdmin = userRole === "admin";

  const initialFormState = {
    organization: "",
    economicClassification: "",
    sourceOfFunding: "",
    naturalAccount: "",
    appropriation: "",
    allotment: "",
    year: ""
  };

  const [form, setForm] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

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
      // UPDATE
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
      // CREATE
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

  /* =========================
     FETCH DATA
  ========================== */
  useEffect(() => {
    dispatch(fetchAllLoadedData());
  }, [dispatch]);

  /* =========================
     SEARCH QUERY
  ========================== */

  const filteredRecords = records.filter((record) => {
    //If the search box is empty return
    if (!searchQuery.trim()) return true;

    //makes search case-insensitive.
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

  /* =========================
     PAGINATION
  ========================== */
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      organization: row.organization,
      economicClassification: row.economicClassification,
      sourceOfFunding: row.sourceOfFunding,
      naturalAccount: row.naturalAccount,
      appropriation: row.appropriation,
      allotment: row.allotment,
      year: row.year
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //DELETE
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
        className="flex flex-col gap-4 w-full mx-auto"
      >
        <div className="flex flex-col border-0 shadow-lg bg-white px-4 py-4 w-full gap-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mt-4">
            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Organization
              </label>
              <input
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter organization..."
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Economic Classification
              </label>
              <input
                type="text"
                name="economicClassification"
                value={form.economicClassification}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter economic classification..."
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4">
            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Source of Funding
              </label>
              <input
                type="text"
                name="sourceOfFunding"
                value={form.sourceOfFunding}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter source of funding..."
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Natural Account
              </label>
              <input
                type="text"
                name="naturalAccount"
                value={form.naturalAccount}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter natural account..."
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-6">
            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Appropriation
              </label>
              <input
                type="number"
                name="appropriation"
                value={form.appropriation}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter appropriation..."
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Allotment
              </label>
              <input
                type="number"
                name="allotment"
                value={form.allotment}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter allotment..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-6">
            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="py-[0.7rem] px-2 w-full outline rounded"
                placeholder="Enter year..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 font-semibold transition duration-300 shadow-md cursor-pointer lg:w-[10%]"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Submit"}
          </button>
        </div>

        {/* Messages */}
        {/* {error && (
          <p className="text-red-500 text-sm mt-2">{error.message || error}</p>
        )} */}
      </form>

      <div className="flex flex-col">
        {/* --- SEARCH BAR --- */}
        <div className="flex items-center justify-between mb-6 w-full ">
          <input
            type="text"
            placeholder="Search any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded-md w-full lg:w-1/3 md:w-1/2"
          />
        </div>

        {loading ? (
          <TableSkeleton
            headers={[
              "S.N",
              "Organization",
              "Economic Classification",
              "Source of Funding",
              "Natural Account",
              "Appropriation (GHS)",
              "Allotment (GHS)",
              "Date Created",
              "Actions",
            ]}
          />
        ) : (
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">S.N</th>
              <th className="border px-3 py-2">Organization</th>
              <th className="border px-3 py-2">Economic Classification</th>
              <th className="border px-3 py-2">Source of Funding</th>
              <th className="border px-3 py-2">Natural Account</th>
              <th className="border px-3 py-2">Appropriation (GHS)</th>
              <th className="border px-3 py-2">Allotment (GHS)</th>
              <th className="border px-3 py-2">Date Created</th>
              <th className="border px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedRecords.map((row, index) => (
                <tr key={row.id} className="text-center">
                  <td className="border px-2 py-1 font-semibold">
                    {startIndex + index + 1}
                  </td>
                  <td className="border px-2 py-1">{row.organization}</td>
                  <td className="border px-2 py-1">
                    {row.economicClassification}
                  </td>
                  <td className="border px-2 py-1">{row.sourceOfFunding}</td>
                  <td className="border px-2 py-1">{row.naturalAccount}</td>
                  <td className="border px-2 py-1 text-right">
                    {Number(row.appropriation).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {Number(row.allotment).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(row.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border px-2 py-1">
                    <div className="flex items-center justify-center gap-3">
                      {isAdmin && (
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          title="Edit"
                        >
                          <PencilSquare className="w-5 h-5" />
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() =>
                            openDeleteModal(row, startIndex + index + 1)
                          }
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredRecords.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/*      DELETE MODAL    */}

      {isDeleteModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-400">Confirm Delete</h3>
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
