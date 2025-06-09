import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import Card from "../components/Card";
import LineChart from "../components/Charts/LineChart";

const Dashboard = () => {
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
            <span className="text-blue-600 font-medium">Dashboard</span>
          </nav>

          {/* Page content */}
          <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <p className="mb-6">Welcome to AbsenGo! Here's an overview of today's activity.</p>

            {/* Section wrapper */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Section - 2/3 */}
              <div className="basis-2/3">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card title="Active Students">
                    <p className="text-3xl font-bold text-blue-600">120</p>
                    <p className="text-sm text-gray-500 mt-1">registered this semester</p>
                  </Card>
                  <Card title="Present Today">
                    <p className="text-3xl font-bold text-green-600">87</p>
                    <p className="text-sm text-gray-500 mt-1">students marked attendance</p>
                  </Card>
                  <Card title="Absent Today">
                    <p className="text-3xl font-bold text-red-600">33</p>
                    <p className="text-sm text-gray-500 mt-1">students yet to mark attendance</p>
                  </Card>
                </div>

                {/* Attendance Trend */}
                <div className="mt-8">
                  <Card title="Weekly Attendance Trend" className="w-full">
                    <LineChart />
                  </Card>
                </div>
              </div>

              {/* Right Section - 1/3 */}
              <div className="basis-1/3 space-y-6">
                <Card title="Latest Announcements">
                  <ul className="text-sm list-disc list-inside space-y-2">
                    <li>OOP class at 10:00 moved to Lab 3</li>
                    <li>Algorithm assignment due this Friday</li>
                    <li>Public holiday on August 17</li>
                  </ul>
                </Card>

                <Card title="Students Yet to Check In">
                  <ul className="text-sm space-y-1">
                    <li>1. Andi Pratama</li>
                    <li>2. Sari Melati</li>
                    <li>3. Budi Santoso</li>
                    <li>4. Rina Kartika</li>
                    <li className="text-blue-500 cursor-pointer">View all...</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
