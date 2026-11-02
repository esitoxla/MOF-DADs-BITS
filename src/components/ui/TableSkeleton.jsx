export default function TableSkeleton({
  headers = [],
  columns = 6,
  rows = 8,
  variant = "list",
}) {
  const labels = headers.length
    ? headers
    : Array.from({ length: columns }, () => null);

  const isReport = variant === "report";
  const tableClass = isReport
    ? "min-w-full table-auto border border-gray-400 text-sm"
    : "data-table min-w-full text-sm";
  const theadClass = isReport
    ? "bg-blue-50 text-gray-800 font-semibold"
    : "";
  const thClass = isReport
    ? "border border-gray-400 px-3 py-2 text-left"
    : "text-left";
  const tdClass = isReport ? "border border-gray-400 px-3 py-3" : "";

  return (
    <div
      className={
        isReport ? "w-full overflow-x-auto bg-white" : "data-table-wrap w-full"
      }
    >
      <table className={tableClass}>
        <thead className={theadClass}>
          <tr>
            {labels.map((label, i) => (
              <th key={i} className={thClass}>
                {label || (
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="bg-white">
              {labels.map((_, colIndex) => (
                <td key={colIndex} className={tdClass}>
                  <div
                    className="h-3 bg-gray-200 rounded animate-pulse"
                    style={{
                      width: `${65 + ((rowIndex + colIndex) % 4) * 8}%`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
