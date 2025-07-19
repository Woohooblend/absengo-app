import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  // Keep verification checks but don't force redirect
  useEffect(() => {
    const checkVerification = () => {
      const gpsVerified = localStorage.getItem("gps_verified") === "true";
      const wifiVerified = localStorage.getItem("wifi_verified") === "true";

      // If not verified, show warning
      if (!gpsVerified || !wifiVerified) {
        const warnings = [];
        if (!gpsVerified) warnings.push("GPS location");
        if (!wifiVerified) warnings.push("WiFi connection");
        
        console.warn(`Please verify your ${warnings.join(" and ")} in the verification page`);
      }
    };

    checkVerification();
  }, []);

  // Only block access if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
