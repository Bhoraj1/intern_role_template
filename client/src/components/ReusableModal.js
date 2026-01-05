"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../features/auth/authSlice";

export default function ReusableModal({ 
  isOpen, 
  onClose, 
  type = "add", // "add" or "delete"
  title,
  subtitle,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  userToDelete = null,
  size = "md" // "sm", "md", "lg"
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const { role: currentUserRole } = useSelector((state) => state.user);
  const [register, { isLoading, error }] = useRegisterMutation();

  const getRoleOptions = () => {
    const roleHierarchy = {
      super_admin: ["admin", "manager", "staff", "user"],
      admin: ["manager", "staff", "user"],
      manager: ["staff", "user"],
      staff: ["user"],
    };
    return roleHierarchy[currentUserRole] || ["user"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "add") {
      try {
        await register(formData).unwrap();
        setFormData({ username: "", email: "", password: "", role: "user" });
        onClose();
      } catch (err) {
        console.error("Registration failed:", err);
      }
    } else if (type === "delete") {
      onConfirm();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm": return "max-w-md";
      case "lg": return "max-w-4xl";
      default: return "max-w-2xl";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${getSizeClass()} transform transition-all duration-300 scale-100`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
          >
            <span className="text-gray-400 text-xl font-bold">
              ×
            </span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {type === "add" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {getRoleOptions().map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{userToDelete?.username}</strong>? 
                This action cannot be undone.
              </p>
            </div>
          )}

          {error && type === "add" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <span className="w-5 h-5 text-red-400 text-lg flex items-center justify-center">
                  ⚠
                </span>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {error.data?.message || "Registration failed"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center ${
                type === "delete" 
                  ? "bg-red-600 text-white hover:bg-red-700" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin -ml-1 mr-3 h-5 w-5 text-white flex items-center justify-center">
                    ◐
                  </span>
                  {type === "delete" ? "Deleting..." : "Creating..."}
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}