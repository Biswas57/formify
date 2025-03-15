import { NavLink } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-4">Total Forms</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-4">Form Submissions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-4">Recent Activity</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">2h ago</p>
        </div>
      </div>
      
      <div className="mt-10 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Recent Forms</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Patient Registration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 10, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <NavLink to="/dashboard/form/1" className="text-blue-600 hover:text-blue-800">View</NavLink>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Contact Information</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 5, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <NavLink to="/dashboard/form/2" className="text-blue-600 hover:text-blue-800">View</NavLink>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Medical History</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Feb 28, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <NavLink to="/dashboard/form/3" className="text-blue-600 hover:text-blue-800">View</NavLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


/*
sidebar - links to different pages:
- my forms
  - list of forms that link to saved form page
- create new form ****
  - once we save - goes to saved form page


saved form page:
- record for that form
- see past filled out forms for that form.

filled out forms
- for each form -> filled out from different clients.


create new form:
- form preview
- form rearrange
- template blocks
- custom blocks*
- save button -> sent to backend

- maintain state of current form arrangement.
- enum type - for various form blocks
- each form block has fields (object)
- 
*/