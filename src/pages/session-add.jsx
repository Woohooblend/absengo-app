import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import api from "../api/index";

const SessionAdd = () => {
  const [classId, setClassId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [location, setLocation] = useState("");
  const [sessionHourStart, setSessionHourStart] = useState("");
  const [sessionHourEnd, setSessionHourEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/class/get");
      setClasses(res.data);
    } catch (err) {
      setClasses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await api.post("/class/session/post", {
        ClassID: classId,
        SessionDate: sessionDate,
        location,
        sessionHourStart,
        sessionHourEnd,
      });
      setSuccess("Session added successfully!");
      setClassId("");
      setSessionDate("");
      setLocation("");
      setSessionHourStart("");
      setSessionHourEnd("");
    } catch (err) {
      setError("Failed to add session. Please check your input and try again.");
    } finally {
      setLoading(false);
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
            <span className="text-blue-600 font-medium">Add Session</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Add New Session</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Class</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.id} - {cls.ClassDetail}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Session Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Session Start Hour</label>
                <input
                  type="time"
                  value={sessionHourStart}
                  onChange={(e) => setSessionHourStart(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Session End Hour</label>
                <input
                  type="time"
                  value={sessionHourEnd}
                  onChange={(e) => setSessionHourEnd(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Session"}
              </button>
              {success && <div className="text-green-600 mt-2">{success}</div>}
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionAdd; 