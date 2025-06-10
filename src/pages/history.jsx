import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const History = () => {
  const [filterBy, setFilterBy] = useState("Subject");
  const [data, setData] = useState([]);

  useEffect(() => {
    const attendance = JSON.parse(
      localStorage.getItem("attendance_history") || "[]"
    );
    setData(attendance);
  }, []);

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
            <span className="text-blue-600 font-medium">
              Attendance History
            </span>
          </nav>

          {/* Page Title */}
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-10">
            AbsenGo Attendance History
          </h2>

          {/* History Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Filter Section */}
            <div className="flex items-center mb-4 space-x-2">
              <span className="text-sm font-semibold text-gray-600">
                Filter
              </span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
              >
                <option value="Subject">Subjects</option>
                <option value="Time">Time</option>
              </select>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 text-sm font-semibold text-gray-600 border-b pb-2 mb-2">
              <div>Subject</div>
              <div>Lecturer</div>
              <div>Time</div>
              <div>Check-in Status</div>
              <div>Check-out Status</div>
            </div>

            {/* Table Rows */}
            {data.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 text-sm text-gray-700 py-2 border-b last:border-b-0"
              >
                <div>{item.subject}</div>
                <div>{item.lecturer}</div>
                <div>{item.time}</div>
                <div>{item.checkin}</div>
                <div>{item.checkout}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
