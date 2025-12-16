import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLoadedData } from "../store/features/appropriationSlice";

export default function AppropriationSingleForm() {
  const dispatch = useDispatch();
  const { loading, error, uploadResponse } = useSelector(
    (state) => state.appropriation
  );

  const [form, setForm] = useState({
    organization: "",
    economicClassification: "",
    sourceOfFunding: "",
    naturalAccount: "",
    appropriation: "",
    allotment: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createLoadedData(form));
  };

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
        {error && (
          <p className="text-red-500 text-sm mt-2">{error.message || error}</p>
        )}

        {uploadResponse && (
          <p className="text-green-600 text-sm mt-2">
            {uploadResponse.message}
          </p>
        )}
      </form>
    </div>
  );
}
