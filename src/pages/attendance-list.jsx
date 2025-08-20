import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Edit2, Save, X, Trash2 } from "lucide-react";
import api from "../api/index";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ studentID: "", sessionID: "", checkInTime: "", checkOutTime: "", attendanceStatus: "" });
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    studentID: "",
    sessionID: "",
    CourseName: "",
    SessionDate: "",
    checkInTime: "",
    checkOutTime: "",
    attendanceStatus: ""
  });

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/attendance/all");
      setAttendances(res.data);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (att) => {
    setEditingId(att.id);
    setEditData({
      studentID: att.studentID,
      sessionID: att.sessionID,
      checkInTime: att.checkInTime,
      checkOutTime: att.checkOutTime,
      attendanceStatus: att.attendanceStatus,
    });
  };

  const handleSave = async (att) => {
    try {
      await api.patch(`/attendance/patch/${att.id}`, {
        studentID: editData.studentID,
        sessionID: editData.sessionID,
        checkInTime: editData.checkInTime,
        checkOutTime: editData.checkOutTime,
        attendanceStatus: editData.attendanceStatus,
      });
      setSuccess("Attendance updated successfully!");
      setEditingId(null);
      fetchAttendances();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to update attendance.");
    }
  };

  const handleDelete = async (att) => {
    if (!window.confirm("Are you sure you want to delete this attendance?")) return;
    try {
      await api.delete(`/attendance/delete/${att.id}`);
      setSuccess("Attendance deleted successfully!");
      fetchAttendances();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to delete attendance.");
    }
  };

  // Filter attendances based on filter values
  const filteredAttendances = attendances.filter(att =>
    (filters.id === "" || String(att.id).toLowerCase().includes(filters.id.toLowerCase())) &&
    (filters.studentID === "" || String(att.studentID || "").toLowerCase().includes(filters.studentID.toLowerCase())) &&
    (filters.sessionID === "" || String(att.sessionID || "").toLowerCase().includes(filters.sessionID.toLowerCase())) &&
    (filters.CourseName === "" || (att.CourseName || "").toLowerCase().includes(filters.CourseName.toLowerCase())) &&
    (filters.SessionDate === "" || (att.SessionDate || "").toLowerCase().includes(filters.SessionDate.toLowerCase())) &&
    (filters.checkInTime === "" || (att.checkInTime || "").toLowerCase().includes(filters.checkInTime.toLowerCase())) &&
    (filters.checkOutTime === "" || (att.checkOutTime || "").toLowerCase().includes(filters.checkOutTime.toLowerCase())) &&
    (filters.attendanceStatus === "" || (att.attendanceStatus ? 'Present' : 'Absent').toLowerCase().includes(filters.attendanceStatus.toLowerCase()))
  );

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
            <span className="text-blue-600 font-medium">Attendance List</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Attendance List</h2>
            {success && <div className="text-green-600 mb-2">{success}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Student ID</th>
                    <th className="px-4 py-2 text-left">Session ID</th>
                    <th className="px-4 py-2 text-left">Course Name</th>
                    <th className="px-4 py-2 text-left">Session Date</th>
                    <th className="px-4 py-2 text-left">Check In</th>
                    <th className="px-4 py-2 text-left">Check Out</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.id} onChange={e => setFilters(f => ({ ...f, id: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.studentID} onChange={e => setFilters(f => ({ ...f, studentID: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.sessionID} onChange={e => setFilters(f => ({ ...f, sessionID: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.CourseName} onChange={e => setFilters(f => ({ ...f, CourseName: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.SessionDate} onChange={e => setFilters(f => ({ ...f, SessionDate: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.checkInTime} onChange={e => setFilters(f => ({ ...f, checkInTime: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.checkOutTime} onChange={e => setFilters(f => ({ ...f, checkOutTime: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.attendanceStatus} onChange={e => setFilters(f => ({ ...f, attendanceStatus: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-gray-500 py-4">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendances.map((att) => (
                      <tr key={att.id} className="border-t">
                        <td className="px-4 py-2">{att.id}</td>
                        <td className="px-4 py-2">
                          {editingId === att.id ? (
                            <input
                              type="text"
                              value={editData.studentID}
                              onChange={(e) => setEditData({ ...editData, studentID: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            att.studentID
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === att.id ? (
                            <input
                              type="text"
                              value={editData.sessionID}
                              onChange={(e) => setEditData({ ...editData, sessionID: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            att.sessionID
                          )}
                        </td>
                        <td className="px-4 py-2">{att.CourseName || '-'}</td>
                        <td className="px-4 py-2">{att.SessionDate || '-'}</td>
                        <td className="px-4 py-2">
                          {editingId === att.id ? (
                            <input
                              type="text"
                              value={editData.checkInTime}
                              onChange={(e) => setEditData({ ...editData, checkInTime: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            att.checkInTime || '-'
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === att.id ? (
                            <input
                              type="text"
                              value={editData.checkOutTime}
                              onChange={(e) => setEditData({ ...editData, checkOutTime: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            att.checkOutTime || '-'
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === att.id ? (
                            <input
                              type="text"
                              value={editData.attendanceStatus}
                              onChange={(e) => setEditData({ ...editData, attendanceStatus: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            att.attendanceStatus ? 'Present' : 'Absent'
                          )}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === att.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(att)}
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
                                  onClick={() => handleEdit(att)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(att)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList; 