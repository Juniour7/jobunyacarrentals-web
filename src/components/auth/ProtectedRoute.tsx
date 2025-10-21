import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check it
  if (role && user?.roles !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
