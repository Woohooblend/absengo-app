import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import api from "../api/index";

const CourseAdd = () => {
  const [courseName, setCourseName] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await api.post("/class/course/post", {
        CourseName: courseName,
        CourseDetail: courseDetail,
      });
      setSuccess("Course added successfully!");
      setCourseName("");
      setCourseDetail("");
    } catch (err) {
      setError("Failed to add course. Please check your input and try again.");
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
            <span className="text-blue-600 font-medium">Add Course</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Add New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Course Detail</label>
                <textarea
                  value={courseDetail}
                  onChange={(e) => setCourseDetail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Course"}
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

export default CourseAdd; 