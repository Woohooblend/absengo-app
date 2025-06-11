import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import LineChart from "../components/Charts/LineChart";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("attendance_history") || "[]");
    setAttendance(data);
    setPresentCount(data.filter(item => item.checkin === "Done").length);
    setAbsentCount(data.filter(item => item.checkin !== "Done").length);
  }, []);

  const attendanceRate = attendance.length > 0
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

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
            <h2 className="text-2xl font-semibold mb-4">My Activity</h2>
            <p className="mb-6">Welcome to AbsenGo! Here is your attendance summary.</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card title="Total Classes">
                <p className="text-3xl font-bold text-blue-600">{attendance.length}</p>
              </Card>
              <Card title="Present">
                <p className="text-3xl font-bold text-green-600">{presentCount}</p>
              </Card>
              <Card title="Attendance Rate">
                <p className="text-3xl font-bold text-indigo-600">{attendanceRate}%</p>
              </Card>
            </div>

            {/* Chart */}
            <div className="mb-8">
              <LineChart />
            </div>

            {/* Recent Attendance */}
            <Card title="Recent Attendance" className="mb-8">
              <ul className="divide-y">
                {attendance.length === 0 ? (
                  <li className="py-2 text-gray-400 italic">No attendance history yet.</li>
                ) : (
                  attendance.slice(-5).reverse().map((item, idx) => (
                    <li key={idx} className="py-2 flex justify-between items-center">
                      <span>
                        <span className="font-medium">{item.subject}</span> — {item.time}
                      </span>
                      <span className={item.checkin === "Done" ? "text-green-600" : "text-red-600"}>
                        {item.checkin === "Done" ? "Present" : "Absent"}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </Card>

            {/* Announcements */}
            <Card title="Latest Announcements">
              <ul className="text-sm list-disc list-inside space-y-2">
                <li>OOP class at 10:00 moved to Lab 3</li>
                <li>Algorithm assignment due this Friday</li>
                <li>Public holiday on August 17</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
