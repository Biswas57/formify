import { useNavigate, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the auth token cookie by setting its expiration to a past date
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text italic pb-3">Formify</h1>
      <nav className="space-y-2">
        {/* <div className="mb-6">
          <p className="text-gray-500 text-sm uppercase font-medium mb-2">
            Main
          </p>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
        </div> */}

        <div className="mb-6">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            Create New Form
          </NavLink>
          <NavLink
            to="/dashboard/myforms"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            My Forms
          </NavLink>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-gray-600 hover:text-white bg-white border border-gray-200 hover:bg-rose-600 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
