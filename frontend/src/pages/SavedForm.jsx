import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormPreview from "../components/FormPreview";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function SavedForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(
          `https://unihack-2025.onrender.com/api/auth/forms/${formId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${getCookie("auth_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch form details");
        }
        const data = await response.json();
        setForm(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!form) return <p>No form data found.</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{form.form_name}</h1>

      {/* Display Form Structure using FormPreview */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <FormPreview blocks={form.blocks} />
      </div>

      {/* Add Record Button */}
      <button
        onClick={() => navigate(`/dashboard/form/${formId}/record`)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md"
      >
        Record Audio
      </button>
    </div>
  );
}
