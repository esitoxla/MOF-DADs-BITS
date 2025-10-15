import React from "react";
import { Fragment } from "react";

const EconomicClassificationTable = ({ data }) => {
  return (
    <>
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200">
        {/* <h2 className="text-xl font-bold text-center text-green-800 mb-6">
        Summary of Budget Performance by Economic Classification
      </h2> */}

        {/* header */}
        <div class=" flex justify-between items-center mb-2 bg-blue-50 w-full">
          {/* <!-- Left Text Section --> */}
          <div class=" flex flex-col space-y-1 pr-6 border-r-5 border-white p-4 font-bold text-lg w-[80%]">
            <h1 class="">
              Summary of Budget Performance by Economic Classification and
              funding
            </h1>
            <p class="text-sm">
              DADs: The organisation of the user who runs the report
            </p>
            <p class="text-sm">Year: 2025</p>
            <p class="text-sm">Currency: Ghana cedis (GHS)</p>
          </div>

          {/* <!-- Right Logo Section --> */}

          <div class="flex items-center justify-center w-[20%]">
            <span class="font-bold  text-[#03381E]">MoF Logo</span>
          </div>
        </div>

        <table className="min-w-full table-auto border border-gray-400 text-sm text-gray-800">
          <thead className="bg-gray-100">
            <tr className="text-center font-semibold">
              <th
                rowSpan="2"
                className="border border-gray-400 px-4 py-3 text-left bg-blue-50"
              >
                EXPENDITURE ITEM
              </th>
              <th
                colSpan="5"
                className="border border-gray-400 px-4 py-2 bg-blue-100"
              >
                2025 PERFORMANCE (GHS)
              </th>
            </tr>
            <tr className="text-center font-semibold bg-blue-50">
              <th className="border border-gray-400 px-3 py-2">
                2025 APPROVED BUDGET / APPROPRIATION
              </th>
              <th className="border border-gray-400 px-3 py-2">
                AMOUNT RELEASED AS AT END AUG 2025
              </th>
              <th className="border border-gray-400 px-3 py-2">
                ACTUAL EXPENDITURE AS AT END AUG 2025
              </th>
              <th className="border border-gray-400 px-3 py-2">
                ACTUAL PAYMENTS AS AT END AUG 2025
              </th>
              <th className="border border-gray-400 px-3 py-2">
                PROJECTIONS AS AT 31 DEC 2025
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <Fragment key={index}>
                {/* Main row */}
                <tr className="font-semibold bg-gray-50">
                  <td className="border border-gray-400 px-4 py-2 text-left">
                    {item.title}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {item.totalBudget.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {item.amountReleased.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {item.actualExpenditure.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {item.actualPayments.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {item.projection.toLocaleString()}
                  </td>
                </tr>

                {/* Breakdown rows (GoG, IGF, DPF) */}
                {item.breakdown?.map((b, i) => (
                  <tr key={i} className="text-gray-700">
                    <td className="border border-gray-400 px-8 py-2 text-left italic">
                      {b.source}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {b.totalBudget.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {b.amountReleased.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {b.actualExpenditure.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {b.actualPayments.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {b.projection.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}

            {/* Total Row */}
            <tr className="bg-green-50 font-bold text-green-800">
              <td className="border border-gray-400 px-4 py-2 text-left">
                TOTAL
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data.reduce((a, b) => a + b.totalBudget, 0).toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data
                  .reduce((a, b) => a + b.amountReleased, 0)
                  .toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data
                  .reduce((a, b) => a + b.actualExpenditure, 0)
                  .toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data
                  .reduce((a, b) => a + b.actualPayments, 0)
                  .toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data.reduce((a, b) => a + b.projection, 0).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EconomicClassificationTable;
