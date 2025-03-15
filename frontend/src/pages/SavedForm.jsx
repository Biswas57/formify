import { useParams } from "react-router-dom";

export default function SavedForm() {
  const { formId } = useParams();
  
  // Mock data for demo purposes
  const form = {
    id: formId,
    name: formId === "1" ? "Patient Registration" : formId === "2" ? "Contact Information" : "Medical History",
    created: "Mar 10, 2025",
    submissions: formId === "1" ? 12 : formId === "2" ? 8 : 4,
    blocks: [
      { type: "IDExtended", fields: ["name", "phone", "email", "address", "dob"] },
      { type: "Medical", fields: ["allergies", "medications", "medicalHistory"] }
    ]
  };
  
  // Mock submissions data
  const submissions = [
    { id: 1, date: "Mar 15, 2025", user: "John Doe", status: "Complete" },
    { id: 2, date: "Mar 14, 2025", user: "Jane Smith", status: "Complete" },
    { id: 3, date: "Mar 13, 2025", user: "Robert Johnson", status: "Complete" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{form.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold">Created On</h3>
          <p className="text-gray-600 mt-2">{form.created}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold">Total Submissions</h3>
          <p className="text-gray-600 mt-2">{form.submissions}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold">Form Status</h3>
          <p className="text-green-600 mt-2">Active</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Form Structure</h2>
          
          <div className="space-y-4">
            {form.blocks.map((block, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-blue-600">{block.type}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {block.fields.map((field, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors w-full">
              Edit Form
            </button>
          </div>
        </div>
        
        <div className="md:col-span-7 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Recent Submissions</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{submission.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{submission.user}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <button>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
