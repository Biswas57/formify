import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FormCreate from "./pages/FormCreate";
import MyForms from "./pages/MyForms";
import SavedForm from "./pages/SavedForm";
import RecordPage from "./pages/RecordPage";
import FilledForm from "./pages/FilledForm";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

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
        <Route path="formcreate" element={<FormCreate />} />
        <Route path="myforms" element={<MyForms />} />
        <Route path="form/:formId" element={<SavedForm />} />
        <Route path="form/:formId/record" element={<RecordPage />} />
        <Route path="form/:formId/filled" element={<FilledForm />} />
      </Route>
    </Routes>
  );
}
