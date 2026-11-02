import { useEffect, useState } from "react";
import { ChevronDown, Mail, Plus, Search } from "lucide-react";
import { Trash } from "../helpers/trash";
import { PencilSquare } from "../helpers/edit";
import IconAction from "../components/ui/IconAction";
import toast from "react-hot-toast";
import NewUser from "../components/NewUser";
import UpdateUser from "../components/UpdateUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../store/features/userSlice";
import Pagination from "../components/Pagination";
import { organizationOptions } from "../data/BudgetExpenditureData";
import { getOrganizationLabel } from "../helpers/organizationLabel";

const COLUMNS =
  "grid min-w-0 flex-1 grid-cols-[minmax(0,1.45fr)_minmax(0,1.35fr)_minmax(0,0.75fr)_minmax(0,1.25fr)_minmax(0,0.7fr)_minmax(0,0.95fr)] items-center gap-x-3";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "data_entry", label: "Data entry" },
  { value: "reviewer", label: "Reviewer" },
  { value: "approver", label: "Approver" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const ACCENT_COLORS = [
  {
    bar: "bg-amber-400",
    avatar:
      "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    bar: "bg-rose-500",
    avatar:
      "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300",
  },
  {
    bar: "bg-sky-500",
    avatar:
      "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  },
  {
    bar: "bg-emerald-500",
    avatar:
      "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  {
    bar: "bg-violet-500",
    avatar:
      "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  },
  {
    bar: "bg-orange-500",
    avatar:
      "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
  },
];

const STATUS_LABEL = {
  active: "text-emerald-600 dark:text-[#39FF88]",
  inactive: "text-amber-600 dark:text-amber-300",
  suspended: "text-rose-500 dark:text-rose-300",
};

function nameInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatRole(role = "") {
  return role.replaceAll("_", " ");
}

function formatLastLogin(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toOptions(values, labelFor = (value) => value) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { sensitivity: "base" }),
    )
    .map((value) => ({ value, label: labelFor(value) }));
}

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-600 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
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

function UsersSkeleton() {
  return (
    <div>
      <div className="h-12 rounded-2xl bg-[#e8f6ee] dark:bg-[rgba(57,255,136,0.12)]" />
      <div className="mt-3 space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex overflow-hidden rounded-2xl bg-white shadow-[0_8px_22px_rgba(15,23,42,0.05)]"
          >
            <span className="w-1.5 shrink-0 bg-gray-200" />
            <div className="flex flex-1 items-center gap-4 px-4 py-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
              <div className="h-3 flex-1 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { users, totalUsers, loading } = useSelector((state) => state.user);
  const userRows = Array.isArray(users) ? users : [];

  const { authUser } = useSelector((state) => state.auth);
  const isAdmin = authUser?.role === "admin";

  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage }));
  }, [dispatch, currentPage]);

  const filteredUsers = userRows.filter((user) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [user.name, user.email, user.role, user.organization, user.status].some(
        (field) => field?.toLowerCase().includes(query),
      );

    return (
      matchesSearch &&
      (!nameFilter || user.name === nameFilter) &&
      (!emailFilter || user.email === emailFilter) &&
      (!roleFilter || user.role === roleFilter) &&
      (!organizationFilter || user.organization === organizationFilter) &&
      (!statusFilter || user.status === statusFilter)
    );
  });

  const nameOptions = toOptions(userRows.map((user) => user.name));
  const emailOptions = toOptions(userRows.map((user) => user.email));
  const roleOptions = toOptions(
    [
      ...ROLE_OPTIONS.map((option) => option.value),
      ...userRows.map((user) => user.role),
    ],
    (value) =>
      ROLE_OPTIONS.find((option) => option.value === value)?.label ||
      formatRole(value),
  );
  const organizationFilterOptions = toOptions(
    [
      ...organizationOptions
      .filter((option) => option.value !== "ALL")
      .map((option) => option.value),
      ...userRows.map((user) => user.organization),
    ],
    getOrganizationLabel,
  );
  const statusOptions = toOptions(
    [
      ...STATUS_OPTIONS.map((option) => option.value),
      ...userRows.map((user) => user.status),
    ],
    (value) =>
      STATUS_OPTIONS.find((option) => option.value === value)?.label || value,
  );

  const openDeleteModal = (user) => {
    setRecordToDelete({ user });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(recordToDelete.user.id)).unwrap();
      toast.success("User deleted successfully!");
      dispatch(fetchAllUsers({ page: currentPage }));
    } catch (err) {
      toast.error(err || "Failed to delete user.");
    } finally {
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, role, organization or status..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            value={nameFilter}
            onChange={setNameFilter}
            placeholder="All names"
            options={nameOptions}
          />
          <FilterSelect
            value={emailFilter}
            onChange={setEmailFilter}
            placeholder="All emails"
            options={emailOptions}
          />
          <FilterSelect
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="All roles"
            options={roleOptions}
          />
          <FilterSelect
            value={organizationFilter}
            onChange={setOrganizationFilter}
            placeholder="All organizations"
            options={organizationFilterOptions}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All statuses"
            options={statusOptions}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {filteredUsers.length} of {userRows.length} users
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#166534] px-3 py-2 text-sm font-medium text-white hover:bg-[#14532d] dark:bg-[#39FF88] dark:text-[#0B132B] dark:hover:bg-[#2eeb78]"
          >
            <Plus className="h-4 w-4" />
            Create New User
          </button>
        </div>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <UsersSkeleton />
        </div>
      ) : (
        <div>
          <div>
            <div className="flex items-center rounded-2xl border border-[#d7ecdf] bg-[#e8f6ee] py-3.5 text-[11px] font-semibold uppercase tracking-wide text-[#166534] shadow-sm dark:border-[#39FF88]/25 dark:bg-[rgba(57,255,136,0.12)] dark:text-[#39FF88]">
              <span className="w-1.5 shrink-0" aria-hidden="true" />
              <div className={`${COLUMNS} px-4`}>
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Organization</span>
                <span>Status</span>
                <span>Last login</span>
              </div>
              <span className="w-[6.25rem] shrink-0 pr-4 text-right">Actions</span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="mt-3 rounded-2xl bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                No users match these filters.
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {filteredUsers.map((user, index) => {
                  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
                  const statusLabel =
                    STATUS_LABEL[user.status] || "text-gray-500";
                  return (
                    <article
                      key={user.id}
                      className="flex items-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)]"
                    >
                      <div className={`w-1.5 self-stretch ${accent.bar}`} />
                      <div className={`${COLUMNS} px-4 py-3.5`}>
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${accent.avatar}`}
                          >
                            {nameInitials(user.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-800">
                              {user.name}
                            </p>
                            {user.username && (
                              <p className="truncate text-xs text-gray-500">
                                {user.username}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                          {user.email ? (
                            <span className="truncate" title={user.email}>
                              {user.email}
                            </span>
                          ) : (
                            <span className="italic text-gray-400">No email</span>
                          )}
                        </div>

                        <span className="truncate text-sm capitalize text-gray-700">
                          {user.role ? formatRole(user.role) : "—"}
                        </span>

                        <div className="min-w-0">
                          <p
                            className="truncate text-sm text-gray-800"
                            title={getOrganizationLabel(user.organization)}
                          >
                            {getOrganizationLabel(user.organization) || "—"}
                          </p>
                          {user.designation && (
                            <p className="truncate text-xs text-gray-500">
                              {user.designation}
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-sm font-medium capitalize ${statusLabel}`}
                        >
                          {user.status || "—"}
                        </span>

                        <span
                          className="truncate text-sm text-gray-600"
                          title={formatLastLogin(user.lastLogin)}
                        >
                          {formatLastLogin(user.lastLogin)}
                        </span>
                      </div>

                      <div className="flex w-[6.25rem] shrink-0 items-center justify-end gap-2 pr-4">
                        {isAdmin && (
                          <IconAction
                            label="Edit"
                            tone="edit"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                          >
                            <PencilSquare />
                          </IconAction>
                        )}
                        {isAdmin && (
                          <IconAction
                            label="Delete"
                            tone="delete"
                            onClick={() => openDeleteModal(user)}
                          >
                            <Trash />
                          </IconAction>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalUsers}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      <UpdateUser
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <NewUser isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      {isDeleteModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-400">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete item{" "}
              <span className="font-semibold text-green-800">
                “{recordToDelete?.user?.name}”
              </span>
              ?
            </p>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn btn-error text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)}>
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
}
