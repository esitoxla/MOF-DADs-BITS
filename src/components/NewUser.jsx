import React, { useState } from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/features/userSlice";


export default function NewUser({ isOpen, onClose }) {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { successMessage } = useSelector((store) => store.user);

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
      .then((res) => {
        toast.success("User added successfully!");

        // give the toast time to show before unmounting
        setTimeout(() => {
          onClose(); // close modal
          navigate("/dashboard/users", { replace: true });
        }, 1000); // 1second delay
      })
      .catch((err) => {
        toast.error(err || "Failed to add user");
        console.error(err);
      });

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs transition-all duration-300">
      <div
        className="absolute inset-0"
        onClick={onClose} // closes modal when background is clicked
      ></div>

      <div className="relative flex flex-col m-6 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-col justify-center py-4 px-4 md:px-8 w-full">
          <span className="mb-6 text-2xl font-semibold">Add a new user</span>

          <form className="space-y-8" onSubmit={handleAddUser}>
            {/* First row: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Second row: Password & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                  value={userDetails.username}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Third row: Role & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  type="text"
                  name="role"
                  placeholder="Enter role"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                  value={userDetails.role}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ")} {/* Makes it look nice */}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
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
            </div>

            {/* Fourth row: Organization & Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Enter organization"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                  value={userDetails.organization}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      organization: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
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

            {/* Submit row */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
     
    </div>
  );
}
