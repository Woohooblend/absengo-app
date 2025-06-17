import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if verification has expired (24 hours)
    const lastReset = localStorage.getItem("last_verification_reset");
    const now = new Date().getTime();
    
    if (!lastReset || (now - parseInt(lastReset)) >= 86400000) {
      // Reset verification status
      localStorage.removeItem("gps_verified");
      localStorage.removeItem("wifi_verified");
      localStorage.setItem("last_verification_reset", now.toString());
      setIsVerified(false);
    }

    // Update verification status
    const gpsVerified = localStorage.getItem("gps_verified") === "true";
    const wifiVerified = localStorage.getItem("wifi_verified") === "true";
    setIsVerified(gpsVerified && wifiVerified);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn,
      isVerified,
      setIsVerified
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);