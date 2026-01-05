"use client";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authState";

export default function Dashboard() {
  const { username, email, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Username:</span> {username}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Role:</span> {role}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
