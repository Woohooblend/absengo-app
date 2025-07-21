import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import api from "../api/index";

const AttendanceAdd = () => {
  const [studentId, setStudentId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchSessions();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/user/all");
      setStudents(res.data);
    } catch (err) {
      setStudents([]);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await api.get("/class/session");
      setSessions(res.data);
    } catch (err) {
      setSessions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await api.post("/attendance/post", {
        studentID: studentId,
        sessionID: sessionId,
      });
      setSuccess("Attendance record added successfully!");
      setStudentId("");
      setSessionId("");
    } catch (err) {
      setError("Failed to add attendance record. Please check your input and try again.");
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
            <span className="text-blue-600 font-medium">Add Attendance</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Add Attendance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.id} - {student.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Session</label>
                <select
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.id} - {session.SessionDate} {session.CourseName ? `- ${session.CourseName}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Attendance"}
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

export default AttendanceAdd; 