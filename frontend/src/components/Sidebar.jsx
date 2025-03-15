import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Formify</h1>
      <nav className="space-y-2">
        <div className="mb-6">
          <p className="text-gray-500 text-sm uppercase font-medium mb-2">Main</p>
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </NavLink>
        </div>

        <div className="mb-6">
          <p className="text-gray-500 text-sm uppercase font-medium mb-2">Forms</p>
          <NavLink 
            to="/dashboard/myforms" 
            className={({ isActive }) => 
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Forms
          </NavLink>
          <NavLink 
            to="/dashboard/formcreate" 
            className={({ isActive }) => 
              `flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 transition-all ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Form
          </NavLink>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <NavLink 
            to="/login" 
            className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
