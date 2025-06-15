import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Reset verification status every 24 hours
  useEffect(() => {
    // First, check if we need to reset based on last reset time
    const lastReset = localStorage.getItem("last_verification_reset");
    const now = new Date().getTime();

    if (lastReset && now - parseInt(lastReset) < 86400000) {
      // If less than 24 hours has passed, don't reset yet
      return;
    }

    const resetInterval = setInterval(() => {
      // Remove verification status from localStorage
      localStorage.removeItem("gps_verified");
      localStorage.removeItem("wifi_verified");

      // Store the reset time
      localStorage.setItem("last_verification_reset", new Date().getTime().toString());

      // Update state
      setIsVerified(false);

      // Notify user if logged in
      if (isLoggedIn) {
        alert("Daily verification required. Please verify your location and WiFi connection.");
      }
    }, 86400000); // 86400000ms = 24 hours

    // Cleanup interval when component unmounts
    return () => clearInterval(resetInterval);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isVerified,
        setIsVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);