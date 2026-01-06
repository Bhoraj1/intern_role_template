import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";

export const adminRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <Users />,
  },
];