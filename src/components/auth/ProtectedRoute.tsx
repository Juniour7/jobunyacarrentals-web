import { Navigate } from "react-router-dom";

// Helper function for safer JSON parsing
const safeJSONParse = (item) => {
  try {
    const value = localStorage.getItem(item);
    // If the value is null, "undefined" string, or truly undefined, return an empty object.
    // Otherwise, attempt to parse.
    if (value === null || value === "undefined" || value === undefined) {
      return {};
    }
    return JSON.parse(value);
  } catch (e) {
    console.error(`Error parsing ${item} from localStorage:`, e);
    // Optionally remove the corrupted item
    localStorage.removeItem(item);
    return {}; // Return an empty object on error
  }
};

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = safeJSONParse("user"); // Use the helper function

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check it
  // Ensure user exists and has a roles property before checking
  if (role && (!user || user.roles !== role)) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;