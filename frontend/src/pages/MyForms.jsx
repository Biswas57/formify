import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function MyForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/forms/list/", {
          method: "GET",
          headers: {
            "Authorization": `Token ${getCookie("auth_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }

        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleRowClick = (formId) => {
    navigate(`/dashboard/form/${formId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Forms</h1>
        <NavLink
          to="/dashboard/formcreate"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Form
        </NavLink>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-gray-500">Loading forms...</div>
          </div>
        ) : forms.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No forms found</p>
            <NavLink
              to="/dashboard/formcreate"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first form
            </NavLink>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.map((form) => (
                  <tr 
                    key={form.id} 
                    onClick={() => handleRowClick(form.id)}
                    className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                      <div className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-3 text-gray-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {form.form_name}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}