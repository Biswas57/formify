import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FormCreate from "./pages/FormCreate";
import MyForms from "./pages/MyForms";
import SavedForm from "./pages/SavedForm";
import DashboardLayout from "./components/DashboardLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="formcreate" element={<FormCreate />} />
        <Route path="myforms" element={<MyForms />} />
        <Route path="form/:formId" element={<SavedForm />} />
      </Route>
    </Routes>
  );
}