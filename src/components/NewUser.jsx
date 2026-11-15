import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { addUser } from "../store/features/userSlice";
import { organizationOptions } from "../data/BudgetExpenditureData";

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

export default function NewUser({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    role: "",
    status: "",
    organization: "",
    designation: "",
  });

  const roles = ["Select role", "admin", "data_entry", "reviewer", "approver"];
  const statuses = ["Select status", "active", "inactive", "suspended"];

  async function handleAddUser(e) {
    e.preventDefault();

    const {
      name,
      email,
      password,
      username,
      role,
      organization,
      designation,
    } = userDetails;

    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (!username) {
      toast.error("Username is required");
      return;
    }
    if (!role) {
      toast.error("Role is required");
      return;
    }
    if (!organization) {
      toast.error("Organization is required");
      return;
    }
    if (!designation) {
      toast.error("Status is required");
      return;
    }

    dispatch(addUser(userDetails))
      .unwrap()
      .then(() => {
        toast.success("User added successfully!");

        setTimeout(() => {
          onClose();
          navigate("/dashboard/users", { replace: true });
        }, 1000);
      })
      .catch((err) => {
        toast.error(err || "Failed to add user");
        console.error(err);
      });
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-user-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div>
            <h2
              id="new-user-title"
              className="text-xl font-bold text-green-800"
            >
              Add a new user
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create an account and assign a role, organization, and
              designation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleAddUser}
        >
          <div className="overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  className={fieldClass}
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  className={fieldClass}
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className={fieldClass}
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  className={fieldClass}
                  value={userDetails.username}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </label>
                <select
                  name="role"
                  className={fieldClass}
                  value={userDetails.role}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </label>
                <select
                  name="status"
                  className={fieldClass}
                  value={userDetails.status}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, status: e.target.value })
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Organization
                </label>
                <select
                  name="organization"
                  className={fieldClass}
                  value={userDetails.organization}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      organization: e.target.value,
                    })
                  }
                >
                  <option value="">Select organization</option>
                  {organizationOptions
                    .filter(
                      (org) =>
                        org.value !== "" &&
                        String(org.value).toUpperCase() !== "ALL",
                    )
                    .map((org) => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  className={fieldClass}
                  value={userDetails.designation}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      designation: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
