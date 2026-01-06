import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/features/authSlice";
import { logout } from "../redux/features/authState";
import { toast } from "react-toastify";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed!");
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/admin/dashboard"
                className="block p-2 hover:bg-blue-700 rounded"
              >
                Dashboard
              </Link>
            </li>
            {role !== "user" && (
              <li className="mb-2">
                <Link
                  to="/admin/users"
                  className="block p-2 hover:bg-gray-700 rounded"
                >
                  Users
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
