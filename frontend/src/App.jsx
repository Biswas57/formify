import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FormCreate from "./pages/FormCreate";
import MyForms from "./pages/MyForms";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import FormWithRecorder from "./pages/FormWithRecorder";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FormCreate />} />
        <Route path="myforms" element={<MyForms />} />
        <Route path="form/:formId" element={<FormWithRecorder />} />
      </Route>
    </Routes>
  );
}
