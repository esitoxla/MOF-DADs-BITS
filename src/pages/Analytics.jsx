import React from "react";
import {
  Line,
  CartesianGrid,
  PieChart,
  LineChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  // Dummy expenditure data
  const monthlyData = [
    { month: "Jan", expenditure: 1200000 },
    { month: "Feb", expenditure: 2100000 },
    { month: "Mar", expenditure: 3500000 },
    { month: "Apr", expenditure: 4400000 },
    { month: "May", expenditure: 5200000 },
    { month: "Jun", expenditure: 7700000 },
  ];

  const categoryData = [
    { name: "GOG", value: 40000000 },
    { name: "IGF", value: 34000000 },
    { name: "DP Fund", value: 20500000 },
  ];

  const formatToMillions = (num) => {
    return `${Math.round(num / 1_000_000)}M`;
  };

 const COLORS = ["#16a34a", "#65a30d", "#ca8a04", "#facc15", "#a3e635"];


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-green-50">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
        Expenditure Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Bar Chart - Monthly Expenditure */}
        {/* <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-700">
            Monthly Expenditure Overview
          </h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="expenditure"
                  fill="#16a34a"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-700">
            Monthly Expenditure Overview (GHS)
          </h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={730}
                height={250}
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#000" />
                <YAxis
                  stroke="#000"
                  tickFormatter={(value) => `${Math.round(value / 1_000_000)}M`}
                />
                <Tooltip
                  formatter={(value) => `${Math.round(value / 1_000_000)}M`}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#000", fontWeight: 600 }}>
                      {value}
                    </span>
                  )}
                />
                <Line
                  type=""
                  dataKey="expenditure"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/*  Pie Chart - Category Breakdown */}
        <div className="bg-white p-4 sm:p-4 rounded-2xl shadow-md w-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-700">
            Budget performance by source of funding (GHS)
          </h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#16a34a"
                  dataKey="value"
                  labelLine={{
                    stroke: "#374151", // dark gray pointer color
                    strokeWidth: 1.5,
                    length: 40,
                    
                  }}
                  label={({ value, x, y }) => (
                    <text
                      x={x}
                      y={y}
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={14}
                      className="p-3"
                    >
                      {formatToMillions(value)}
                    </text>
                  )}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatToMillions(value)} />

                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#374151", fontWeight: 600 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
