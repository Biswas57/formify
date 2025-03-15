export default function Login() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Username" />
      <input className="w-full p-2 border rounded mb-4" type="password" placeholder="Password" />
      <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
    </div>
  );
}
