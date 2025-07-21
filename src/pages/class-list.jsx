import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Edit2, Save, X, Trash2 } from "lucide-react";
import api from "../api/index";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ClassDetail: "" });
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    CourseID: "",
    LecturerID: "",
    ClassDetail: ""
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/class/get");
      setClasses(res.data);
    } catch (err) {
      setError("Failed to fetch classes.");
    } finally {
      setLoading(false);
    }
  };

  // Filter classes based on filter values
  const filteredClasses = classes.filter(cls =>
    (filters.id === "" || String(cls.id).toLowerCase().includes(filters.id.toLowerCase())) &&
    (filters.CourseID === "" || String(cls.CourseID || "").toLowerCase().includes(filters.CourseID.toLowerCase())) &&
    (filters.LecturerID === "" || String(cls.LecturerID || "").toLowerCase().includes(filters.LecturerID.toLowerCase())) &&
    (filters.ClassDetail === "" || (cls.ClassDetail || "").toLowerCase().includes(filters.ClassDetail.toLowerCase()))
  );

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setEditData({ ClassDetail: cls.ClassDetail });
  };

  const handleSave = async (cls) => {
    try {
      await api.patch(`/classsession/patch/${cls.id}`, { ClassDetail: editData.ClassDetail });
      setSuccess("Class updated successfully!");
      setEditingId(null);
      fetchClasses();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to update class.");
    }
  };

  const handleDelete = async (cls) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.get(`/classsession/delete/${cls.id}`); // Assuming GET for delete as per your backend
      setSuccess("Class deleted successfully!");
      fetchClasses();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to delete class.");
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
            <span className="text-blue-600 font-medium">Class List</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Class List</h2>
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
                    <th className="px-4 py-2 text-left">Course ID</th>
                    <th className="px-4 py-2 text-left">Lecturer ID</th>
                    <th className="px-4 py-2 text-left">Class Detail</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.id} onChange={e => setFilters(f => ({ ...f, id: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.CourseID} onChange={e => setFilters(f => ({ ...f, CourseID: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.LecturerID} onChange={e => setFilters(f => ({ ...f, LecturerID: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.ClassDetail} onChange={e => setFilters(f => ({ ...f, ClassDetail: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 py-4">
                        No classes found.
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((cls) => (
                      <tr key={cls.id} className="border-t">
                        <td className="px-4 py-2">{cls.id}</td>
                        <td className="px-4 py-2">{cls.CourseID}</td>
                        <td className="px-4 py-2">{cls.LecturerID}</td>
                        <td className="px-4 py-2">
                          {editingId === cls.id ? (
                            <input
                              type="text"
                              value={editData.ClassDetail}
                              onChange={(e) => setEditData({ ...editData, ClassDetail: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            cls.ClassDetail
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === cls.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(cls)}
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
                                  onClick={() => handleEdit(cls)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(cls)}
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

export default ClassList; 