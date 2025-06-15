import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Trash2, Edit2, Save, X } from "lucide-react";

const History = () => {
  const [filterBy, setFilterBy] = useState("Subject");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    subject: "",
    time: "",
    checkin: "Not Yet",
    checkout: "Not Yet",
  });

  // Load data
  useEffect(() => {
    const attendance = JSON.parse(
      localStorage.getItem("attendance_history") || "[]"
    );
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    const uniqueSubjects = [...new Set(attendance.map((item) => item.subject))];
    setSubjects(["All", ...uniqueSubjects]);

    setData(attendance);
    setFilteredData(attendance);
  }, []);

  // Filter data
  useEffect(() => {
    let filtered = [...data];
    if (filterBy === "Subject" && selectedSubject !== "All") {
      filtered = filtered.filter((item) => item.subject === selectedSubject);
    }
    if (filterBy === "Time" && selectedDate) {
      filtered = filtered.filter((item) => {
        const [day, month] = item.time.split(" ");
        const itemDate = new Date(
          `${month} ${day} ${new Date().getFullYear()}`
        );
        const filterDate = new Date(selectedDate);
        return itemDate.toDateString() === filterDate.toDateString();
      });
    }
    setFilteredData(filtered);
  }, [filterBy, selectedSubject, selectedDate, data]);

  // Handle edit
  const handleEdit = (item, index) => {
    setEditingId(index);
    setEditData({
      subject: item.subject,
      time: item.time,
      checkin: item.checkin,
      checkout: item.checkout,
    });
  };

  // Handle save
  const handleSave = (index) => {
    const newData = [...data];
    newData[index] = { ...newData[index], ...editData };
    setData(newData);
    localStorage.setItem("attendance_history", JSON.stringify(newData));
    setEditingId(null);
  };

  // Handle delete
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      localStorage.setItem("attendance_history", JSON.stringify(newData));
    }
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
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">
                          {editingId === idx ? (
                            <input
                              type="text"
                              value={editData.subject}
                              onChange={(e) =>
                                setEditData({ ...editData, subject: e.target.value })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            item.subject
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === idx ? (
                            <input
                              type="text"
                              value={editData.time}
                              onChange={(e) =>
                                setEditData({ ...editData, time: e.target.value })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            item.time
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === idx ? (
                            <select
                              value={editData.checkin}
                              onChange={(e) =>
                                setEditData({ ...editData, checkin: e.target.value })
                              }
                              className="w-full px-2 py-1 border rounded"
                            >
                              <option value="Not Yet">Not Yet</option>
                              <option value="Done">Done</option>
                            </select>
                          ) : (
                            <span
                              className={
                                item.checkin === "Done"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {item.checkin}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === idx ? (
                            <select
                              value={editData.checkout}
                              onChange={(e) =>
                                setEditData({ ...editData, checkout: e.target.value })
                              }
                              className="w-full px-2 py-1 border rounded"
                            >
                              <option value="Not Yet">Not Yet</option>
                              <option value="Done">Done</option>
                            </select>
                          ) : (
                            <span
                              className={
                                item.checkout === "Done"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {item.checkout}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === idx ? (
                              <>
                                <button
                                  onClick={() => handleSave(idx)}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Save"
                                >
                                  <Save size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 text-gray-600 hover:text-gray-800"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(item, idx)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(idx)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
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
