import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Plus, Search } from "lucide-react";
import CashForm from "../components/CashForm";
import CashTableDetails, {
  filterCashRecords,
} from "../components/CashTableDetails";
import { cancelEditing } from "../store/features/cashSlice";
import { cashAccountOptions, cashCurrencyOptions } from "../data/CashFormData";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Approved", label: "Approved" },
];

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

export default function CashPage() {
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.cash);

  const [searchQuery, setSearchQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const hasFilters = Boolean(
    searchQuery.trim() || accountFilter || currencyFilter || statusFilter,
  );
  const recordList = Array.isArray(records) ? records : [];
  const matchCount = filterCashRecords(recordList, {
    searchQuery,
    accountFilter,
    currencyFilter,
    statusFilter,
  }).length;

  const closeForm = useCallback(() => {
    setFormOpen(false);
    dispatch(cancelEditing());
  }, [dispatch]);

  const openAdd = () => {
    dispatch(cancelEditing());
    setFormOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setAccountFilter("");
    setCurrencyFilter("");
    setStatusFilter("");
  };

  return (
    <div className="w-full px-4 py-6 md:px-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Cash Position</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search, filter, and manage cash balances by account.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#14532d] dark:bg-[#39FF88] dark:text-[#0B132B] dark:hover:bg-[#2eeb78]"
        >
          <Plus className="h-4 w-4" />
          Add Record
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search date, account, currency, balance or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FilterSelect
            value={accountFilter}
            onChange={setAccountFilter}
            placeholder="All accounts"
            options={cashAccountOptions}
          />
          <FilterSelect
            value={currencyFilter}
            onChange={setCurrencyFilter}
            placeholder="All currencies"
            options={cashCurrencyOptions}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All statuses"
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {matchCount} of {recordList.length} records
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer text-sm font-semibold text-green-800 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <CashTableDetails
        searchQuery={searchQuery}
        accountFilter={accountFilter}
        currencyFilter={currencyFilter}
        statusFilter={statusFilter}
        onOpenForm={() => setFormOpen(true)}
      />

      <CashForm isOpen={formOpen} onClose={closeForm} />
    </div>
  );
}
