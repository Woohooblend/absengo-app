import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Edit2, Save, X } from "lucide-react";
import api from "../api/index";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ firstName: "", lastName: "", email: "", PhoneNumber: "", username: "" });
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    PhoneNumber: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/user/all");
      setStudents(res.data);
    } catch (err) {
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on filter values
  const filteredStudents = students.filter(student =>
    (filters.id === "" || String(student.id).toLowerCase().includes(filters.id.toLowerCase())) &&
    (filters.username === "" || (student.username || "").toLowerCase().includes(filters.username.toLowerCase())) &&
    (filters.firstName === "" || (student.firstName || "").toLowerCase().includes(filters.firstName.toLowerCase())) &&
    (filters.lastName === "" || (student.lastName || "").toLowerCase().includes(filters.lastName.toLowerCase())) &&
    (filters.email === "" || (student.email || "").toLowerCase().includes(filters.email.toLowerCase())) &&
    (filters.PhoneNumber === "" || (student.PhoneNumber || "").toLowerCase().includes(filters.PhoneNumber.toLowerCase()))
  );

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      PhoneNumber: student.PhoneNumber,
      username: student.username,
    });
  };

  const handleSave = async (student) => {
    try {
      // Only allow editing self, so PATCH /user/patch/self
      await api.patch(`/user/patch/self`, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        PhoneNumber: editData.PhoneNumber,
        username: editData.username,
      });
      setSuccess("Student updated successfully!");
      setEditingId(null);
      fetchStudents();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to update student.");
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
            <span className="text-blue-600 font-medium">Student List</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Student List</h2>
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
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone Number</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-1">
                      <input
                        type="text"
                        value={filters.id}
                        onChange={e => setFilters(f => ({ ...f, id: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Filter"
                      />
                    </th>
                    <th className="px-4 py-1">
                      <input
                        type="text"
                        value={filters.username}
                        onChange={e => setFilters(f => ({ ...f, username: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Filter"
                      />
                    </th>
                    <th className="px-4 py-1">
                      <input
                        type="text"
                        value={filters.firstName}
                        onChange={e => setFilters(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Filter"
                      />
                    </th>
                    <th className="px-4 py-1">
                      <input
                        type="text"
                        value={filters.lastName}
                        onChange={e => setFilters(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Filter"
                      />
                    </th>
                    <th className="px-4 py-1">
                      <input
                        type="text"
                        value={filters.email}
                        onChange={e => setFilters(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Filter"
                      />
                    </th>
                    <th className="px-4 py-1">
                      <input
                        type="text"
                        value={filters.PhoneNumber}
                        onChange={e => setFilters(f => ({ ...f, PhoneNumber: e.target.value }))}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Filter"
                      />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-gray-500 py-4">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-t">
                        <td className="px-4 py-2">{student.id}</td>
                        <td className="px-4 py-2">
                          {editingId === student.id ? (
                            <input
                              type="text"
                              value={editData.username}
                              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            student.username
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === student.id ? (
                            <input
                              type="text"
                              value={editData.firstName}
                              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            student.firstName
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === student.id ? (
                            <input
                              type="text"
                              value={editData.lastName}
                              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            student.lastName
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === student.id ? (
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            student.email
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === student.id ? (
                            <input
                              type="text"
                              value={editData.PhoneNumber}
                              onChange={(e) => setEditData({ ...editData, PhoneNumber: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            student.PhoneNumber
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === student.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(student)}
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
                                  onClick={() => handleEdit(student)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
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

export default StudentList; 