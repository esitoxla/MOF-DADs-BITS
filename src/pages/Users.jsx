import React, { useEffect, useState } from "react";
import { Plus, Search, ArrowBigDown } from "lucide-react";
import { Trash } from "../helpers/trash";
import { PencilSquare } from "../helpers/edit";
import { NavLink } from "react-router";
import NewUser from "../components/NewUser";
import toast from "react-hot-toast";
import UpdateUser from "../components/UpdateUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../store/features/userSlice";
import Pagination from "../components/Pagination";
import TableSkeleton from "../components/ui/TableSkeleton";

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [search, setSearch] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  console.log(recordToDelete);

  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { users, totalUsers, loading } = useSelector((state) => state.user);

  //ADMIN CHECKS
  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;
  const isAdmin = userRole === "admin";

  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage }));
  }, [dispatch, currentPage]);

 
  //SEARCH LOGIC
  const filteredUsers = users.filter((user) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query) ||
      user.status?.toLowerCase().includes(query) ||
      user.organization?.toLowerCase().includes(query) ||
      user.designation?.toLowerCase().includes(query)
    );
  });

  

 

  //DELETE
  const openDeleteModal = (user) => {
    setRecordToDelete({ user });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(recordToDelete.user.id)).unwrap();
      toast.success("User deleted successfully!");
      dispatch(fetchAllUsers());
    } catch (err) {
      toast.error(err || "Failed to delete user.");
    } finally {
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  
  return (
    <div className=" px-6 bg-green-50 min-h-screen">
      {/* Header */}

      <div className="py-6 px-6 bg-green-50 sticky top-0 z-10 flex w-full justify-between">
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

        <div className="w-full">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Create New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white  shadow-lg w-full">
        {loading ? (
          <TableSkeleton
            headers={[
              "Name",
              "Email",
              "Username",
              "Role",
              "Status",
              "Organization",
              "Designation",
              "Last Login",
              "Actions",
            ]}
          />
        ) : (
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
              {filteredUsers.map((user, index) => (
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
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Edit"
                      >
                        <PencilSquare className="w-5 h-5" />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Pagination (EXTERNAL COMPONENT) */}
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

      {/*      DELETE MODAL    */}

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
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
