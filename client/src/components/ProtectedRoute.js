import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userEmail } = useAuth();

  return (
    <div>
      <div style={{ position: "fixed", top: 0, right: 0, background: "#eee", padding: "4px", zIndex: 9999 }}>
        isAuthenticated: {isAuthenticated ? "true" : "false"}<br />
        email: {userEmail || "none"}
      </div>
      {!isAuthenticated ? <Navigate to="/auth" replace /> : children}
    </div>
  );
};

export default ProtectedRoute;