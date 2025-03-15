import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if the auth_token cookie exists
  const authToken = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("auth_token="));

  return authToken ? children : <Navigate to="/login" replace />;
}
