import React from 'react'
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { updateUser } from '../store/features/userSlice';
import toast from 'react-hot-toast';

export default function UpdateUser({ isOpen, onClose, user }) {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    role: "",
    status: "",
    organization: "",
    designation: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        username: user.username || "",
        role: user.role || "",
        status: user.status || "",
        organization: user.organization || "",
        designation: user.designation || "",
      });
    }
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateUser({
          id: user.id,
          data: form,
        })
      ).unwrap();

      toast.success("User updated successfully");
      onClose();
    } catch (err) {
      toast.error(err || "Update failed");
    }
  };


  if (!isOpen) return null;
  //   const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-xs transition-all duration-300"
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
          <span className="mb-6 text-2xl font-semibold">Update user</span>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* First row: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            {/* Second row: Role & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="data_entry">Data Entry</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="approver">Aprrover</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
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
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            {/* Submit row */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
