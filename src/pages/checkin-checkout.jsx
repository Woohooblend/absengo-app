import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";

const CheckinCheckout = () => {
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
            <span className="text-blue-600 font-medium">Check-in & Check-out</span>
          </nav>

          {/* Page Title */}
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-10">
            AbsenGo Check-in and Check-out
          </h2>

          {/* Content Wrapper */}
          <div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-12">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-6 w-[320px]">
              <h3 className="text-blue-600 text-sm font-semibold mb-4">
                Subject Schedules | Today
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Subjects: </span>
                  Algorithm and Programming
                </div>
                <div>
                  <span className="font-medium">Lecturer: </span>
                  Prof. A
                </div>
                <div>
                  <span className="font-medium">Time: </span>
                  3 Sept, Tue, 09:00 - 11:00
                </div>
                <div>
                  <span className="font-medium">Check-in Status: </span>
                  Done
                </div>
                <div>
                  <span className="font-medium">Check-out Status: </span>
                  Not Yet
                </div>
              </div>
            </div>

            {/* Check-in and Check-out Section */}
            <div className="space-y-10 text-center">
              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-in Verification
                </p>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow">
                  Check-in
                </button>
              </div>

              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-out Verification
                </p>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow">
                  Check-out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinCheckout;
