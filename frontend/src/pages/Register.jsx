import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error('Please enter your full name', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          padding: '16px',
        },
        icon: '❌',
      });
      return false;
    }

    if (!form.email.trim()) {
      toast.error('Please enter your email address', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          padding: '16px',
        },
        icon: '❌',
      });
      return false;
    }

    if (!form.password) {
      toast.error('Please enter a password', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          padding: '16px',
        },
        icon: '❌',
      });
      return false;
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters long', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          padding: '16px',
        },
        icon: '❌',
      });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          padding: '16px',
        },
        icon: '❌',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://formify-yg3d.onrender.com/api/auth/register/",
        JSON.stringify({
          email: form.email,
          username: form.fullName,
          password: form.password,
          password2: form.confirmPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        document.cookie = `auth_token=${response.data.token}; path=/`;
        toast.success('Successfully registered!', {
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
      console.error("Register error:", err);
      if (err.response) {
        const errorMessage = err.response.data.error || "Registration failed";
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
          <h1 className="text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text italic pb-3">Formify</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-10 shadow-lg rounded-xl border border-gray-50">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.confirmPassword}
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
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}