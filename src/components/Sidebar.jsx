import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [classMenuOpen, setClassMenuOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const [lecturerMenuOpen, setLecturerMenuOpen] = useState(false);
  const [sessionMenuOpen, setSessionMenuOpen] = useState(false);
  const [attendanceMenuOpen, setAttendanceMenuOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("current_user") || "");
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Verification", path: "/verification" },
    { name: "Check-in & Check-out", path: "/checkin-checkout" },
    { name: "Attendance History", path: "/history" },
    // Class menu will be handled separately
  ];

  // Filter menu items for admin
  const filteredMenuItems = username === "admin"
    ? menuItems.filter(item => item.name === "Dashboard")
    : menuItems;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white min-h-screen transition-all duration-300 ${
          open ? "w-64" : "w-16"
        }`}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            className="text-white focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          {open && <h1 className="text-xl font-bold ml-2">Menu</h1>}
        </div>

        {/* Menu items */}
        <nav className="space-y-2 p-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm"
            >
              {open && <span className="truncate">{item.name}</span>}
              {!open && <span className="sr-only">{item.name}</span>}
            </Link>
          ))}

          {/* Only show these menus if username is 'admin' */}
          {username === "admin" && <>
            {/* Class submenu */}
            <div>
              <button
                onClick={() => setClassMenuOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm w-full text-left focus:outline-none"
              >
                {open && <span className="truncate">Class</span>}
                {!open && <span className="sr-only">Class</span>}
                {open && (classMenuOpen ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />)}
              </button>
              {classMenuOpen && open && (
                <div className="ml-4 space-y-1">
                  <Link
                    to="/class-add"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Add Class
                  </Link>
                  <Link
                    to="/class-list"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Class List
                  </Link>
                </div>
              )}
            </div>

            {/* Course submenu */}
            <div>
              <button
                onClick={() => setCourseMenuOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm w-full text-left focus:outline-none"
              >
                {open && <span className="truncate">Course</span>}
                {!open && <span className="sr-only">Course</span>}
                {open && (courseMenuOpen ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />)}
              </button>
              {courseMenuOpen && open && (
                <div className="ml-4 space-y-1">
                  <Link
                    to="/course-add"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Add Course
                  </Link>
                  <Link
                    to="/course-list"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Course List
                  </Link>
                </div>
              )}
            </div>

            {/* Lecturer submenu */}
            <div>
              <button
                onClick={() => setLecturerMenuOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm w-full text-left focus:outline-none"
              >
                {open && <span className="truncate">Lecturer</span>}
                {!open && <span className="sr-only">Lecturer</span>}
                {open && (lecturerMenuOpen ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />)}
              </button>
              {lecturerMenuOpen && open && (
                <div className="ml-4 space-y-1">
                  <Link
                    to="/lecturer-add"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Add Lecturer
                  </Link>
                  <Link
                    to="/lecturer-list"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Lecturer List
                  </Link>
                </div>
              )}
            </div>

            {/* Session submenu */}
            <div>
              <button
                onClick={() => setSessionMenuOpen && setSessionMenuOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm w-full text-left focus:outline-none"
              >
                {open && <span className="truncate">Session</span>}
                {!open && <span className="sr-only">Session</span>}
                {open && (sessionMenuOpen ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />)}
              </button>
              {sessionMenuOpen && open && (
                <div className="ml-4 space-y-1">
                  <Link
                    to="/session-add"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Add Session
                  </Link>
                  <Link
                    to="/session-list"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Session List
                  </Link>
                </div>
              )}
            </div>

            {/* Attendance submenu */}
            <div>
              <button
                onClick={() => setAttendanceMenuOpen && setAttendanceMenuOpen((v) => !v)}
                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm w-full text-left focus:outline-none"
              >
                {open && <span className="truncate">Attendance</span>}
                {!open && <span className="sr-only">Attendance</span>}
                {open && (attendanceMenuOpen ? <ChevronDown size={16} /> : <ChevronRightIcon size={16} />)}
              </button>
              {attendanceMenuOpen && open && (
                <div className="ml-4 space-y-1">
                  <Link
                    to="/attendance-add"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Add Attendance
                  </Link>
                  <Link
                    to="/attendance-list"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Attendance List
                  </Link>
                </div>
              )}
            </div>

            {/* Student submenu */}
            <div>
              <button
                className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm w-full text-left focus:outline-none"
                style={{ cursor: 'default' }}
                disabled
              >
                {open && <span className="truncate">Student</span>}
                {!open && <span className="sr-only">Student</span>}
              </button>
              {open && (
                <div className="ml-4 space-y-1">
                  <Link
                    to="/student-list"
                    className="block py-1 px-2 rounded hover:bg-gray-700 text-sm"
                  >
                    Student List
                  </Link>
                </div>
              )}
            </div>
          </>}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
