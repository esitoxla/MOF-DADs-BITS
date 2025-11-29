import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PencilSquare } from "../helpers/edit";
import { Trash } from "../helpers/trash";
import { Check } from "../helpers/check";
import { CheckFill } from "../helpers/checkFill";
import { Clipboard } from "../helpers/review";
import toast from "react-hot-toast";
import { fetchRevenues } from "../store/features/revenueSlice";

export default function RevenueTable() {
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector((store) => store.revenue);
  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;
  
  

  useEffect(() => {
    dispatch(fetchRevenues());
  }, [dispatch]);

  
   


  console.log(records);

  if (loading) return <p className="text-center py-4">Loading records...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full overflow-x-auto lg:px-4">
      <table className="min-w-full shadow-lg bg-white">
        <thead className="bg-green-100 text-green-800 font-semibold">
          <tr>
            <th className="border px-2 py-1">S.N</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Revenue Categories</th>
            <th className="border px-2 py-1">Budget Projections</th>
            <th className="border px-2 py-1">Actual Collections</th>
            <th className="border px-2 py-1">Payment into Consolidated Fund</th>
            <th className="border px-2 py-1">Retention Rate (%)</th>
            <th className="border px-2 py-1">Retention</th>
            <th className="border px-2 py-1">Remarks</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record, index) => (
            <tr key={record.id || index} className="text-center">
              <td className="border px-2 py-1">{index + 1}</td>
              <td className="border px-2 py-1">{record.date}</td>
              <td className="border px-2 py-1">{record.revenue_category}</td>
              <td className="border px-2 py-1">{record.budgetProjections}</td>
              <td className="border px-2 py-1">{record.actual_collection}</td>
              <td className="border px-2 py-1">{record.payment_amount}</td>
              <td className="border px-2 py-1">{record.retention_rate}</td>
              <td className="border px-2 py-1">{record.retention_amount}</td>
              <td className="border px-2 py-1">{record.remarks}</td>

              <td className="border px-2 py-1 font-semibold text-blue-900 border-black">
                {record.status}
              </td>

              <td className="px-2 py-1 border text-center">
                <ul className="menu bg-base-100 w-32 z-10">
                  <li>
                    <a className="text-yellow-600 font-semibold cursor-pointer">
                      <PencilSquare /> Edit
                    </a>
                  </li>

                  <li>
                    <span className="text-red-600 font-semibold cursor-pointer">
                      <Trash /> Delete
                    </span>
                  </li>

                  <li>
                    <span className="text-blue-700 font-semibold cursor-pointer">
                      <Clipboard /> Review
                    </span>
                  </li>

                  <li>
                    <span className="text-green-800 font-semibold cursor-pointer">
                      <Check /> Approve
                    </span>
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
