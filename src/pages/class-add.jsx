import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import api from "../api/index";

const ClassAdd = () => {
  const [courseID, setCourseID] = useState("");
  const [lecturerID, setLecturerID] = useState("");
  const [classDetail, setClassDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    // Fetch courses and lecturers for dropdowns
    api.get("/class/course/get").then(res => setCourses(res.data)).catch(() => setCourses([]));
    api.get("/class/lecturer/get").then(res => setLecturers(res.data)).catch(() => setLecturers([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await api.post("/class/post", {
        CourseID: courseID,
        LecturerID: lecturerID,
        ClassDetail: classDetail,
      });
      setSuccess("Class added successfully!");
      setCourseID("");
      setLecturerID("");
      setClassDetail("");
    } catch (err) {
      setError("Failed to add class. Please check your input and try again.");
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
            <span className="text-blue-600 font-medium">Add Class</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Add New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Course</label>
                <select
                  value={courseID}
                  onChange={(e) => setCourseID(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.CourseName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Lecturer</label>
                <select
                  value={lecturerID}
                  onChange={(e) => setLecturerID(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select a lecturer</option>
                  {lecturers.map((lect) => (
                    <option key={lect.id} value={lect.id}>
                      {lect.firstName} {lect.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Class Detail</label>
                <textarea
                  value={classDetail}
                  onChange={(e) => setClassDetail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Class"}
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

export default ClassAdd; 