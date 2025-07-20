import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import LineChart from "../components/Charts/LineChart";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAttendance } from "../api/attendance";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getMonthlyAttendanceRate(attendance) {
  // Map: { '2024-07': { present: X, total: Y } }
  const monthly = {};
  attendance.forEach(item => {
    if (!item.SessionDate) return;
    const date = new Date(item.SessionDate);
    if (isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthly[key]) monthly[key] = { present: 0, total: 0 };
    monthly[key].total++;
    if (item.attendanceStatus === true || item.checkin === "Done") monthly[key].present++;
  });
  // Convert to chart data
  return Object.entries(monthly).map(([key, val]) => {
    const [year, month] = key.split('-');
    const date = new Date(year, month - 1);
    return {
      name: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
      value: val.total > 0 ? Math.round((val.present / val.total) * 100) : 0
    };
  }).sort((a, b) => new Date(`20${a.name.split(' ')[1]}`, new Date(Date.parse(a.name.split(' ')[0] + " 1, 2000")).getMonth()) - new Date(`20${b.name.split(' ')[1]}`, new Date(Date.parse(b.name.split(' ')[0] + " 1, 2000")).getMonth()));
}

function formatHour(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  return `${h}:${m}`;
}

const Dashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAttendance() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAttendance(); // Call backend API
        setAttendance(data);
        setPresentCount(data.filter(item => item.attendanceStatus === true || item.checkin === "Done").length);
        setAbsentCount(data.filter(item => !(item.attendanceStatus === true || item.checkin === "Done")).length);
      } catch (err) {
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const attendanceRate = attendance.length > 0
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

  const monthlyAttendanceData = getMonthlyAttendanceRate(attendance);

  // Sort attendance by start time (ascending)
  const sortedRecentAttendance = attendance.slice().sort((a, b) => {
    const aDate = new Date(`${a.SessionDate}T${a.sessionHourStart || '00:00:00'}`);
    const bDate = new Date(`${b.SessionDate}T${b.sessionHourStart || '00:00:00'}`);
    return aDate - bDate;
  });

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

            {loading ? (
              <div>Loading attendance data...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <>
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
                  <LineChart data={monthlyAttendanceData} />
                </div>

                {/* Recent Attendance */}
                <Card title="Recent Attendance" className="mb-8">
                  <ul className="divide-y">
                    {sortedRecentAttendance.length === 0 ? (
                      <li className="py-2 text-gray-400 italic">No attendance history yet.</li>
                    ) : (
                      sortedRecentAttendance.slice(0, 5).map((item, idx) => {
                        const sessionStart = new Date(`${item.SessionDate}T${item.sessionHourStart || '00:00:00'}`);
                        const now = new Date();
                        let status, statusClass;
                        if (sessionStart > now) {
                          status = "Not Started";
                          statusClass = "text-gray-500";
                        } else if (item.checkInTime) {
                          status = "Present";
                          statusClass = "text-green-600";
                        } else {
                          status = "Absent";
                          statusClass = "text-red-600";
                        }
                        return (
                          <li key={idx} className="py-2 flex justify-between items-center">
                            <span>
                              <span className="font-medium">{item.CourseName || item.ClassDetail || item.ClassID}</span>
                              {' — '}{formatDate(item.SessionDate)}
                              {item.sessionHourStart && item.sessionHourEnd && (
                                <> ({formatHour(item.sessionHourStart)} - {formatHour(item.sessionHourEnd)})</>
                              )}
                            </span>
                            <span className={statusClass}>{status}</span>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </Card>
              </>
            )}
            {/* Announcements */}
            <Card title="Latest Announcements">
              <ul className="text-sm list-disc list-inside space-y-2">
                {loading ? (
                  <li>Loading attendance data...</li>
                ) : error ? (
                  <li className="text-red-600">{error}</li>
                ) : attendance.length === 0 ? (
                  <li className="italic text-gray-400">No recent attendance.</li>
                ) : (
                  attendance.slice(-3).reverse().map((item, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{item.ClassDetail || item.ClassID}</span> — {formatDate(item.SessionDate)}
                    </li>
                  ))
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
