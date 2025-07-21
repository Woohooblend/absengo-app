import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Edit2, Save, X, Trash2 } from "lucide-react";
import api from "../api/index";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ClassID: "", SessionDate: "", location: "", sessionHourStart: "", sessionHourEnd: "" });
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    CourseName: "",
    SessionDate: "",
    location: "",
    sessionHourStart: "",
    sessionHourEnd: ""
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/class/session");
      setSessions(res.data);
    } catch (err) {
      setError("Failed to fetch sessions.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setEditingId(session.id);
    setEditData({
      ClassID: session.ClassID,
      SessionDate: session.SessionDate,
      location: session.location,
      sessionHourStart: session.sessionHourStart,
      sessionHourEnd: session.sessionHourEnd,
    });
  };

  const handleSave = async (session) => {
    try {
      await api.patch(`/class/session/patch/${session.id}`, {
        ClassID: editData.ClassID,
        SessionDate: editData.SessionDate,
        location: editData.location,
        sessionHourStart: editData.sessionHourStart,
        sessionHourEnd: editData.sessionHourEnd,
      });
      setSuccess("Session updated successfully!");
      setEditingId(null);
      fetchSessions();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to update session.");
    }
  };

  const handleDelete = async (session) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await api.delete(`/class/session/delete/${session.id}`);
      setSuccess("Session deleted successfully!");
      fetchSessions();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to delete session.");
    }
  };

  // Filter sessions based on filter values
  const filteredSessions = sessions.filter(session =>
    (filters.id === "" || String(session.id).toLowerCase().includes(filters.id.toLowerCase())) &&
    (filters.CourseName === "" || (session.CourseName || "").toLowerCase().includes(filters.CourseName.toLowerCase())) &&
    (filters.SessionDate === "" || (session.SessionDate || "").toLowerCase().includes(filters.SessionDate.toLowerCase())) &&
    (filters.location === "" || (session.location || "").toLowerCase().includes(filters.location.toLowerCase())) &&
    (filters.sessionHourStart === "" || (session.sessionHourStart || "").toLowerCase().includes(filters.sessionHourStart.toLowerCase())) &&
    (filters.sessionHourEnd === "" || (session.sessionHourEnd || "").toLowerCase().includes(filters.sessionHourEnd.toLowerCase()))
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
            <span className="text-blue-600 font-medium">Session List</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Session List</h2>
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
                    <th className="px-4 py-2 text-left">Course Name</th>
                    <th className="px-4 py-2 text-left">Session Date</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Start Hour</th>
                    <th className="px-4 py-2 text-left">End Hour</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.id} onChange={e => setFilters(f => ({ ...f, id: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.CourseName} onChange={e => setFilters(f => ({ ...f, CourseName: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.SessionDate} onChange={e => setFilters(f => ({ ...f, SessionDate: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.sessionHourStart} onChange={e => setFilters(f => ({ ...f, sessionHourStart: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.sessionHourEnd} onChange={e => setFilters(f => ({ ...f, sessionHourEnd: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-gray-500 py-4">
                        No sessions found.
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => (
                      <tr key={session.id} className="border-t">
                        <td className="px-4 py-2">{session.id}</td>
                        <td className="px-4 py-2">{session.CourseName || '-'}</td>
                        <td className="px-4 py-2">
                          {editingId === session.id ? (
                            <input
                              type="date"
                              value={editData.SessionDate}
                              onChange={(e) => setEditData({ ...editData, SessionDate: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            session.SessionDate
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === session.id ? (
                            <input
                              type="text"
                              value={editData.location}
                              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            session.location
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === session.id ? (
                            <input
                              type="time"
                              value={editData.sessionHourStart}
                              onChange={(e) => setEditData({ ...editData, sessionHourStart: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            session.sessionHourStart
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === session.id ? (
                            <input
                              type="time"
                              value={editData.sessionHourEnd}
                              onChange={(e) => setEditData({ ...editData, sessionHourEnd: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            session.sessionHourEnd
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === session.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(session)}
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
                                  onClick={() => handleEdit(session)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(session)}
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

export default SessionList; 