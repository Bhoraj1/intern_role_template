"use client";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authState";

export default function Sidebar() {
  const { username, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-300">
          {username} ({role})
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Management
          </h3>
        </div>

        <a
          href="#"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors"
        >
          User Management
        </a>
      </nav>

      {/* Logout Button - Fixed at bottom */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
