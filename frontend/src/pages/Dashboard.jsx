import { useSelector } from "react-redux";

const Dashboard = () => {
  const { email, role, isAuth } = useSelector((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {isAuth && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Current User</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {email}</p>
            <p><span className="font-medium">Role:</span> 
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {role}
              </span>
            </p>
          </div>
        </div>
      )}
      
      <p>Welcome to the {role} dashboard!</p>
    </div>
  );
};

export default Dashboard;