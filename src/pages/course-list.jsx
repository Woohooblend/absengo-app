import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Edit2, Save, X, Trash2 } from "lucide-react";
import api from "../api/index";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ CourseName: "", CourseDetail: "" });
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    CourseName: "",
    CourseDetail: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/class/course/get");
      setCourses(res.data);
    } catch (err) {
      setError("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditData({ CourseName: course.CourseName, CourseDetail: course.CourseDetail });
  };

  const handleSave = async (course) => {
    try {
      await api.patch(`/class/course/patch/${course.id}`, {
        CourseName: editData.CourseName,
        CourseDetail: editData.CourseDetail,
      });
      setSuccess("Course updated successfully!");
      setEditingId(null);
      fetchCourses();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to update course.");
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.get(`/class/course/delete/${course.id}`); // Assuming GET for delete as per your backend
      setSuccess("Course deleted successfully!");
      fetchCourses();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to delete course.");
    }
  };

  // Filter courses based on filter values
  const filteredCourses = courses.filter(course =>
    (filters.id === "" || String(course.id).toLowerCase().includes(filters.id.toLowerCase())) &&
    (filters.CourseName === "" || (course.CourseName || "").toLowerCase().includes(filters.CourseName.toLowerCase())) &&
    (filters.CourseDetail === "" || (course.CourseDetail || "").toLowerCase().includes(filters.CourseDetail.toLowerCase()))
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
            <span className="text-blue-600 font-medium">Course List</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Course List</h2>
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
                    <th className="px-4 py-2 text-left">Course Detail</th>
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
                      <input type="text" value={filters.CourseDetail} onChange={e => setFilters(f => ({ ...f, CourseDetail: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 py-4">
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="border-t">
                        <td className="px-4 py-2">{course.id}</td>
                        <td className="px-4 py-2">
                          {editingId === course.id ? (
                            <input
                              type="text"
                              value={editData.CourseName}
                              onChange={(e) => setEditData({ ...editData, CourseName: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            course.CourseName
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === course.id ? (
                            <input
                              type="text"
                              value={editData.CourseDetail}
                              onChange={(e) => setEditData({ ...editData, CourseDetail: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            course.CourseDetail
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === course.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(course)}
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
                                  onClick={() => handleEdit(course)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(course)}
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

export default CourseList; 