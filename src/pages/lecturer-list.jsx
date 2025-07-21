import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, Edit2, Save, X, Trash2 } from "lucide-react";
import api from "../api/index";

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ firstName: "", lastName: "", email: "", PhoneNumber: "" });
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    PhoneNumber: ""
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/class/lecturer/get");
      setLecturers(res.data);
    } catch (err) {
      setError("Failed to fetch lecturers.");
    } finally {
      setLoading(false);
    }
  };

  // Filter lecturers based on filter values
  const filteredLecturers = lecturers.filter(lect =>
    (filters.id === "" || String(lect.id).toLowerCase().includes(filters.id.toLowerCase())) &&
    (filters.firstName === "" || (lect.firstName || "").toLowerCase().includes(filters.firstName.toLowerCase())) &&
    (filters.lastName === "" || (lect.lastName || "").toLowerCase().includes(filters.lastName.toLowerCase())) &&
    (filters.email === "" || (lect.email || "").toLowerCase().includes(filters.email.toLowerCase())) &&
    (filters.PhoneNumber === "" || (lect.PhoneNumber || "").toLowerCase().includes(filters.PhoneNumber.toLowerCase()))
  );

  const handleEdit = (lect) => {
    setEditingId(lect.id);
    setEditData({ firstName: lect.firstName, lastName: lect.lastName, email: lect.email, PhoneNumber: lect.PhoneNumber });
  };

  const handleSave = async (lect) => {
    try {
      await api.patch(`/class/lecturer/patch/${lect.id}`, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        PhoneNumber: editData.PhoneNumber,
      });
      setSuccess("Lecturer updated successfully!");
      setEditingId(null);
      fetchLecturers();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to update lecturer.");
    }
  };

  const handleDelete = async (lect) => {
    if (!window.confirm("Are you sure you want to delete this lecturer?")) return;
    try {
      await api.get(`/class/lecturer/delete/${lect.id}`); // Assuming GET for delete as per your backend
      setSuccess("Lecturer deleted successfully!");
      fetchLecturers();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to delete lecturer.");
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
            <span className="text-blue-600 font-medium">Lecturer List</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Lecturer List</h2>
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
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone Number</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.id} onChange={e => setFilters(f => ({ ...f, id: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.firstName} onChange={e => setFilters(f => ({ ...f, firstName: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.lastName} onChange={e => setFilters(f => ({ ...f, lastName: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.email} onChange={e => setFilters(f => ({ ...f, email: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th className="px-4 py-1">
                      <input type="text" value={filters.PhoneNumber} onChange={e => setFilters(f => ({ ...f, PhoneNumber: e.target.value }))} className="w-full px-2 py-1 border rounded text-xs" placeholder="Filter" />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLecturers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-4">
                        No lecturers found.
                      </td>
                    </tr>
                  ) : (
                    filteredLecturers.map((lect) => (
                      <tr key={lect.id} className="border-t">
                        <td className="px-4 py-2">{lect.id}</td>
                        <td className="px-4 py-2">
                          {editingId === lect.id ? (
                            <input
                              type="text"
                              value={editData.firstName}
                              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            lect.firstName
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === lect.id ? (
                            <input
                              type="text"
                              value={editData.lastName}
                              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            lect.lastName
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === lect.id ? (
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            lect.email
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingId === lect.id ? (
                            <input
                              type="text"
                              value={editData.PhoneNumber}
                              onChange={(e) => setEditData({ ...editData, PhoneNumber: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            lect.PhoneNumber
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {editingId === lect.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(lect)}
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
                                  onClick={() => handleEdit(lect)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(lect)}
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

export default LecturerList; 