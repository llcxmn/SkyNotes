import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
    return children;
};

export default ProtectedRoute;