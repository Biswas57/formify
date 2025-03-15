import { NavLink } from "react-router-dom";

export default function MyForms() {
  const forms = [
    { id: 1, name: "Patient Registration", created: "Mar 10, 2025", submissions: 12, lastSubmission: "2h ago" },
    { id: 2, name: "Contact Information", created: "Mar 5, 2025", submissions: 8, lastSubmission: "1d ago" },
    { id: 3, name: "Medical History", created: "Feb 28, 2025", submissions: 4, lastSubmission: "3d ago" },
    { id: 4, name: "Feedback Survey", created: "Feb 20, 2025", submissions: 0, lastSubmission: "Never" },
    { id: 5, name: "Event Registration", created: "Feb 15, 2025", submissions: 0, lastSubmission: "Never" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <NavLink 
          to="/dashboard/formcreate" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Form
        </NavLink>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Submission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{form.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.submissions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.lastSubmission}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <NavLink to={`/dashboard/form/${form.id}`} className="text-blue-600 hover:text-blue-800">View</NavLink>
                    <span className="text-gray-300">|</span>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
