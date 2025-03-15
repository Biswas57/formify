import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0 p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Formify</h1>
      <nav className="space-y-2">
        <div className="mb-6">
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
        </div>

        <div className="mb-6">
          <p className="text-gray-500 text-sm uppercase font-medium mb-2">
            Forms
          </p>
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
          <NavLink
            to="/dashboard/formcreate"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${
                isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
              }`
            }
          >
            Create New Form
          </NavLink>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <NavLink
            to="/login"
            className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
          >
            Logout
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
