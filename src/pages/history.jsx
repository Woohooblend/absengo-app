import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Trash2, Edit2, Save, X } from "lucide-react";
import { fetchAttendanceHistory } from "../api/attendance";

function formatDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "-";
  const date = new Date(`${dateStr}T${timeStr}`);
  if (isNaN(date.getTime())) return dateStr + ' ' + timeStr;
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

const History = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterBy, setFilterBy] = useState("Subject");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchAttendanceHistory().then(attendance => {
      setData(attendance);
      setFilteredData(attendance);
      setSelectedDate("");
      const uniqueSubjects = [...new Set(attendance.map(item => item.CourseName || "-"))];
      setSubjects(["All", ...uniqueSubjects]);
    });
  }, []);

  useEffect(() => {
    let filtered = [...data];
    if (filterBy === "Subject" && selectedSubject !== "All") {
      filtered = filtered.filter(item => (item.CourseName || "-") === selectedSubject);
    }
    if (filterBy === "Time" && selectedDate) {
      filtered = filtered.filter(item => {
        if (!item.SessionDate) return false;
        return item.SessionDate === selectedDate;
      });
    }
    setFilteredData(filtered);
  }, [filterBy, selectedSubject, selectedDate, data]);

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
            <span className="text-blue-600 font-medium">Attendance History</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Filter Controls */}
            <div className="flex items-center gap-4 mb-6">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="Subject">Filter by Subject</option>
                <option value="Time">Filter by Date</option>
              </select>

              {filterBy === "Subject" ? (
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {subjects.map((subject, idx) => (
                    <option key={idx} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              )}
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Date & Time</th>
                    <th className="px-4 py-2 text-left">Check-in Status</th>
                    <th className="px-4 py-2 text-left">Check-out Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{item.CourseName || '-'}</td>
                        <td className="px-4 py-2">{formatDateTime(item.SessionDate, item.sessionHourStart)}</td>
                        <td className="px-4 py-2">
                          <span className={item.checkInTime ? "text-green-600" : "text-red-600"}>
                            {item.checkInTime ? "Done" : "Not Yet"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={item.checkOutTime ? "text-green-600" : "text-red-600"}>
                            {item.checkOutTime ? "Done" : "Not Yet"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
