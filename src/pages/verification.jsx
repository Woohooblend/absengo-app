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
            <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
              <span className="text-gray-400">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-400">Verification</span>
            </nav>
          </nav>

          {/* Page content */}
          <h2 className="text-2xl font-semibold mb-4">Check-in & Check-out</h2>
          <p>AbsenGo check-in and check-out</p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
