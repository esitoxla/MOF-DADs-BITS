import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Trash } from "../helpers/trash";
import { PencilSquare }from "../helpers/edit"
import { NavLink } from "react-router";
import NewUser from "../components/NewUser";
import UpdateUser from "../components/UpdateUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../store/features/userSlice";


export default function Users() {
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false)
     const [search, setSearch] = useState("");
    
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchAllUsers())
    }, [dispatch]);


    useEffect(() => {
      // Fetch users when page loads or when search changes
      const delayDebounce = setTimeout(() => {
        dispatch(fetchAllUsers({ search })); // pass search term to your thunk
      }, 500); // debounce 500ms to avoid too many requests

      return () => clearTimeout(delayDebounce);
    }, [search, dispatch]);

//   const users = [
//     {
//       id: 1,
//       name: "Nana Ama",
//       email: "nanaama@example.com",
//       username: "nana_ama",
//       role: "admin",
//       status: "active",
//       organization: "Ministry of Finance",
//       designation: "Budget Analyst",
//       lastLogin: "2025-10-21",
//     },
//     {
//       id: 2,
//       name: "Kofi Mensah",
//       email: "kofi.mensah@example.com",
//       username: "kofi_m",
//       role: "employee",
//       status: "inactive",
//       organization: "Ghana Highway Authority",
//       designation: "Engineer",
//       lastLogin: "2025-09-12",
//     },
//   ];

  return (
    <div className=" px-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="py-6 px-6 bg-green-50 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 h-full">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Users
          </h1>
          {/* <hr className="border-gray-300 w-full sm:hidden mb-4" /> */}
          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create New User
            </button>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        <div className="relative mb-6 w-full">
          <input
            type="text"
            placeholder="Search users..."
            className="border border-green-400 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 outline-none w-[50%]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-green-400 w-5 h-5" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white  shadow-lg w-full">
        <div className="">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Username</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Organization</th>
                <th className="px-3 py-3">Designation</th>
                <th className="px-3 py-3">Last Login</th>
                <th className="px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-green-50">
                  <td className="px-3 py-3">{user.name}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">{user.username}</td>
                  <td className="px-3 py-3 capitalize">{user.role}</td>
                  <td
                    className={`px-3 py-3 font-medium capitalize ${
                      user.status === "active"
                        ? "text-green-600"
                        : user.status === "inactive"
                        ? "text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </td>
                  <td className="px-3 py-3">{user.organization}</td>
                  <td className="px-3 py-3">{user.designation}</td>
                  <td className="px-3 py-3">{user.lastLogin}</td>
                  <td className="px-3 py-3 flex items-center justify-center gap-3">
                    <NavLink to="">
                      <button
                        onClick={() => setShowModal(true)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <PencilSquare className="w-5 h-5" />
                      </button>
                    </NavLink>

                    <button className="text-red-600 hover:text-red-800 cursor-pointer">
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
          disabled={true} // change to false when previous page exists
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
          disabled={false} // change to true when on the last page
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <UpdateUser isOpen={showModal} onClose={() => setShowModal(false)} />
      <NewUser isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
