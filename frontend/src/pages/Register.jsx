import { useState } from "react";
export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Username" />
      <input className="w-full p-2 border rounded mb-2" type="password" placeholder="Password" />
      <input className="w-full p-2 border rounded mb-4" type="password" placeholder="Confirm Password" />
      <button className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
    </div>
  );
}