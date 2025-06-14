import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const { setIsLoggedIn } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAutoNotif, setShowAutoNotif] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Fungsi untuk cek absensi hari ini
  const checkAttendanceNotif = () => {
    const attendance = JSON.parse(localStorage.getItem("attendance_history") || "[]");
    const today = "3 Sept, Tue, 09:00 - 11:00"; // Sesuaikan dengan jadwal hari ini

    let notifList = [];
    // Cari data absensi hari ini
    const found = attendance.find(item => item.time === today);

    // Jika belum ada data absensi hari ini, tampilkan notif
    if (!found) {
      notifList.push("⏰ You haven't checked in for today's class!");
      notifList.push("⏰ You haven't checked out for today's class!");
      return notifList;
    }

    // Jika sudah check-in dan check-out, tidak ada notif
    if (found.checkin === "Done" && found.checkout === "Done") {
      return [];
    }

    // Jika salah satu belum, tampilkan notif yang sesuai
    if (found.checkin !== "Done") {
      notifList.push("⏰ You haven't checked in for today's class!");
    }
    if (found.checkout !== "Done") {
      notifList.push("⏰ You haven't checked out for today's class!");
    }
    return notifList;
  };

  // Cek otomatis saat halaman dibuka
  useEffect(() => {
    const notifList = checkAttendanceNotif();
    setNotifications([
      ...notifList,
      "🕘 Class \"OOP\" starts in 30 minutes",
      "📋 10 students haven't checked in yet",
      "📢 New announcement from Prof. Linda"
    ]);
    if (notifList.length > 0) {
      setShowAutoNotif(true);
      setShowNotifications(true);
      // Auto close setelah 3 detik
      setTimeout(() => setShowAutoNotif(false), 3000);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setIsProfileOpen(false);
    // Update notifikasi setiap kali tombol lonceng ditekan
    const notifList = checkAttendanceNotif();
    setNotifications([
      ...notifList,
      "🕘 Class \"OOP\" starts in 30 minutes",
      "📋 10 students haven't checked in yet",
      "📢 New announcement from Prof. Linda"
    ]);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between z-20 relative">
      {/* Left: App Name */}
      <h1 className="text-xl font-bold text-gray-800">
        Absen<span className="text-blue-600">Go</span>
      </h1>

      {/* Center: Search Bar */}
      <div className="flex-1 ml-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center gap-6 relative">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="relative text-gray-600 hover:text-gray-800"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => n.includes("haven't checked")) && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-md shadow-lg z-20">
              <div className="p-4 border-b font-semibold text-gray-700">
                Notifications
              </div>
              <ul className="max-h-60 overflow-y-auto divide-y text-sm text-gray-700">
                {notifications.length === 0 && (
                  <li className="p-3 text-gray-400">No notifications</li>
                )}
                {notifications.map((notif, idx) => (
                  <li key={idx} className="p-3 hover:bg-gray-100 cursor-pointer">
                    {notif}
                  </li>
                ))}
              </ul>
              <div className="p-3 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                View all notifications
              </div>
            </div>
          )}

          {/* Auto pop up notification */}
          {showAutoNotif && notifications.length > 0 && (
            <div className="absolute right-0 mt-14 w-72 bg-blue-50 border border-blue-200 rounded-md shadow-lg z-30 animate-pop">
              <div className="p-4 text-blue-800 font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {notifications[0]}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
            onClick={toggleProfileMenu}
          />
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          .animate-pop {
            animation: pop 0.3s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
