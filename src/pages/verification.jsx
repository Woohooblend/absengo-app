import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";

const Verification = () => {
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
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow">
                Submit Attendance
              </button>
            </div>

            <div className="text-center">
              <p className="text-blue-600 font-medium text-lg mb-2">
                WiFi Verification
              </p>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow">
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;