import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        JSON.stringify(form),  // Ensure JSON body
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      if (response.status === 200) {
        document.cookie = `auth_token=${response.data.token}; path=/`; // Store token in a cookie
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status code:", err.response.status);
        setError(err.response.data.error || "An error occurred.");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Is the backend running?");
      } else {
        console.error("Request error:", err.message);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="w-full p-2 border rounded mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="w-full p-2 border rounded mb-4" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
