import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLoadedData,
  fetchAllLoadedData,
} from "../store/features/appropriationSlice";
import toast from "react-hot-toast";
import { Trash } from "../helpers/trash";
import { PencilSquare } from "../helpers/edit";
import { Search } from "lucide-react";
import Pagination from "./Pagination";
import { useEffect } from "react";

export default function AppropriationSingleForm() {
  const dispatch = useDispatch();
  const { loading, error, uploadResponse, records } = useSelector(
    (state) => state.appropriation
  );

  const initialFormState = {
    organization: "",
    economicClassification: "",
    sourceOfFunding: "",
    naturalAccount: "",
    appropriation: "",
    allotment: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);


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

    // const appropriation = Number(form.appropriation);
    // const allotment = Number(form.allotment);

    // if (Number.isNaN(appropriation) || Number.isNaN(allotment)) {
    //   toast.error("Appropriation and Allotment must be valid numbers");
    //   return;
    // }

    // if (allotment >= appropriation) {
    //   toast.error("Allotment must be less than Appropriation");
    //   return;
    // }

    dispatch(createLoadedData(form));
    toast.success("Data saved successfully!");
    clearForm();
  };

  /* =========================
     FETCH DATA
  ========================== */
  useEffect(() => {
    dispatch(fetchAllLoadedData());
  }, [dispatch]);

  /* =========================
     PAGINATION
  ========================== */
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = records.slice(startIndex, startIndex + PAGE_SIZE);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  /* =========================
     STATES
  ========================== */
  if (loading) {
    return <p className="text-center py-4">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full mx-auto"
      >
        <div className="flex flex-col border-0 shadow bg-white px-4 py-4 w-full gap-6">
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
                placeholder="Organization"
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
                placeholder="Economic classification"
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
                placeholder="Source of funding"
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
                placeholder="Natural account"
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
                placeholder="Appropriation"
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
                placeholder="Allotment"
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
            {loading ? "Saving..." : "Submit"}
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
                      <button
                        onClick={() => setShowModal(true)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <PencilSquare className="w-5 h-5" />
                      </button>

                      <button className="text-red-600 hover:text-red-800 cursor-pointer">
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination (EXTERNAL COMPONENT) */}
        <Pagination
          currentPage={currentPage}
          totalItems={records.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
