import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingCaption, setLoadingCaption] = useState("");
  const [showModal, setShowModal] = useState(false);

  const gpsVerified = localStorage.getItem("gps_verified") === "true";
  const wifiVerified = localStorage.getItem("wifi_verified") === "true";

  // Handler untuk GPS Verification
  const handleGPSVerification = () => {
    setLoadingCaption("Requesting location access...");
    setShowModal(true);
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoadingCaption("Verifying location...");
          setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setShowModal(false);
            // Simpan status verifikasi GPS
            localStorage.setItem("gps_verified", "true");
            setTimeout(() => setSuccess(false), 1500);
          }, 1500);
        },
        (error) => {
          setLoading(false);
          setShowModal(false);
          alert("Location access denied. Please allow location access.");
        }
      );
    } else {
      setLoading(false);
      setShowModal(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handler untuk WiFi Verification
  const handleWiFiVerification = () => {
    setLoadingCaption("Verifying WiFi... Make sure your device is connected to campus's WiFi.");
    setShowModal(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setShowModal(false);
      // Simpan status verifikasi WiFi
      localStorage.setItem("wifi_verified", "true");
      setTimeout(() => setSuccess(false), 1500);
    }, 1500);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-100">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
            <span className="text-gray-400">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Verification</span>
          </nav>

          {/* Page Title */}
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-10">
            AbsenGo Verification
          </h2>

          {/* Verification Buttons */}
          <div className="flex flex-col items-center space-y-10">
            <div className="text-center">
              <p className="text-blue-600 font-medium text-lg mb-2">
                GPS Verification
              </p>
              <button
                className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow ${gpsVerified ? "opacity-50 cursor-not-allowed" : ""}`}

                onClick={() => {
                  if (gpsVerified) {
                    alert("You are already verified for GPS.");
                  } else {
                    handleGPSVerification();
                  }
                }}
                disabled={gpsVerified}
              >
                {gpsVerified ? "You are already verified" : "Submit Attendance"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-blue-600 font-medium text-lg mb-2">
                WiFi Verification
              </p>
              <button
                className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow ${wifiVerified ? "opacity-50 cursor-not-allowed" : ""}`}

                onClick={() => {
                  if (wifiVerified) {
                    alert("You are already verified for WiFi.");
                  } else {
                    handleWiFiVerification();
                  }
                }}
                disabled={wifiVerified}
              >
                {wifiVerified ? "You are already verified" : "Submit Attendance"}
              </button>
            </div>
          </div>

          {/* Modal Loading & Success */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
                <div className="loader mb-4"></div>
                <p className="text-blue-700 font-medium">{loadingCaption}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
                <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-600 font-bold text-xl">Success!</p>
              </div>
            </div>
          )}
          {/* Loader CSS */}
          <style>
            {`
              .loader {
                border: 4px solid #e0e0e0;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default Verification;