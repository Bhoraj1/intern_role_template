import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllUsersQuery,
  useRegisterMutation,
  useDeleteUserMutation,
} from "../redux/features/authSlice";
import DetailsModal from "../components/shared/DetailsModa";
import Input from "../components/shared/Input";
import UploadImage from "../components/shared/UploadImage";
import { toast } from "react-toastify";

const Users = () => {
  const { data: users, error, isLoading, refetch } = useGetAllUsersQuery();
  const { role: currentUserRole, email: currentUserEmail } = useSelector((state) => state.user);
  const [register] = useRegisterMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // Role hierarchy based on current user role
  const getRoleOptions = () => {
    const roleHierarchy = {
      super_admin: ["admin", "manager", "staff", "user"],
      admin: ["manager", "staff", "user"],
      manager: ["staff", "user"],
      staff: ["user"],
    };
    return roleHierarchy[currentUserRole] || [];
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleAddUser = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      await register(formDataToSend).unwrap();
      toast.success("User added successfully!");
      setShowAddModal(false);
      setFormData({ username: "", email: "", password: "", role: "user" });
      setSelectedImage(null);
      refetch();
    } catch (err) {
      toast.error("Failed to add user!");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success("User deleted successfully!");
      setShowDeleteModal(false);
      setSelectedUser(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete user!");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${import.meta.env.VITE_BASE_URL}/${imagePath}`;
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.data?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {user.image ? (
                      <img
                        src={getImageUrl(user.image)}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        {user.username?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    disabled={user.email === currentUserEmail}
                    className={`px-3 py-1 rounded text-xs ${
                      user.email === currentUserEmail
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <DetailsModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        size="3xl"
        footerContent={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add User
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              placeholder="Enter username"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getRoleOptions().map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <UploadImage 
              image={selectedImage} 
              onUpload={handleImageUpload} 
              onRemove={handleImageRemove} 
            />
          </div>
        </div>
      </DetailsModal>

      {/* Delete Confirmation Modal */}
      <DetailsModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        footerContent={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete user{" "}
          <strong>{selectedUser?.username}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This action cannot be undone.
        </p>
      </DetailsModal>
    </div>
  );
};

export default Users;
