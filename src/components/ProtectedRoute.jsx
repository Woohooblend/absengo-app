import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const gpsVerified = localStorage.getItem("gps_verified") === "true";
  const wifiVerified = localStorage.getItem("wifi_verified") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If not verified and not already on verification page, redirect to verification
  if (!gpsVerified || !wifiVerified) {
    if (location.pathname !== "/verification") {
      return <Navigate to="/verification" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
