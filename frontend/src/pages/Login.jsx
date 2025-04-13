import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const authToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("auth_token="));
    if (authToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://formify-yg3d.onrender.com/api/auth/login/",
        JSON.stringify(form),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        document.cookie = `auth_token=${response.data.token}; path=/`;
        toast.success('Successfully logged in!', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#DCFCE7',
            color: '#16A34A',
            padding: '16px',
          },
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        const errorMessage = err.response.data.error || "Invalid credentials";
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '16px',
          },
          icon: '❌',
        });
      } else if (err.request) {
        const errorMessage = "No response from server. Please check your connection";
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '16px',
          },
          icon: '🔌',
        });
      } else {
        const errorMessage = "Something went wrong. Please try again";
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '16px',
          },
          icon: '⚠️',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Toaster />
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      // style={{ filter: 'brightness(0.7)' }}
      >
        <source src="/videoplayback.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text italic pb-3">Formify</h1>
          <h2 className="mt-6 text-2xl font-bold text-stone-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-stone-400">
            Or{" "}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-600">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white/90 backdrop-blur-2xl py-8 px-10 shadow-lg rounded-xl border border-gray-50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
          {/* {error && <p className="text-red-500 text-sm mt-4">{error}</p>} */}
        </div>
      </div>
    </div>
  );
}