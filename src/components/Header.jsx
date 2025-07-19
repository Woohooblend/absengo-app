import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentDateTime } from "../utils/subjects"; // Import the getCurrentDateTime function

// Tambahkan helper untuk parsing jam kelas
const parseTime = (dateTimeStr) => {
  const match = dateTimeStr.match(/(\d{1,2}):00 - (\d{1,2}):00/);
  if (!match) return null;
  return {
    startHour: parseInt(match[1], 10),
    endHour: parseInt(match[2], 10)
  };
};

const Header = () => {
  const { setIsLoggedIn } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAutoNotif, setShowAutoNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Fungsi untuk cek absensi hari ini
  const checkAttendanceNotif = () => {
    const attendance = JSON.parse(localStorage.getItem("attendance_history") || "[]");
    const today = getCurrentDateTime();
    const found = attendance.find(item => item.time === today);

    let notifList = [];

    // Cek window waktu check-in/check-out
    const now = new Date();
    const { startHour, endHour } = parseTime(today) || {};
    if (startHour != null && endHour != null) {
      const classStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0, 0);
      const classEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, 0, 0, 0);
      const checkinOpen = classStart;
      const checkinClose = new Date(classStart.getTime() + 10 * 60000);
      const checkoutOpen = new Date(classEnd.getTime() - 10 * 60000);
      const checkoutClose = classEnd;

      // Notifikasi check-in
      if ((!found || found.checkin !== "Done") && now >= checkinOpen && now <= checkinClose) {
        notifList.push("⚠️ Check-in is open! Please check-in within 10 minutes after class starts.");
      }
      // Notifikasi check-out
      if (found && found.checkin === "Done" && found.checkout !== "Done" && now >= checkoutOpen && now <= checkoutClose) {
        notifList.push("⚠️ Check-out is open! Please check-out within 10 minutes before class ends.");
      }
    }

    // If no attendance record found, show both notifications
    if (!found) {
      notifList.push("⚠️ Don't forget to check-in within 10 minutes after class starts!");
      notifList.push("⚠️ Remember to check-out 10 minutes before class ends!");
      return notifList;
    }

    // Show specific notifications based on status and time
    if (found.checkin !== "Done") {
      notifList.push("⚠️ Check-in period is active - Please check-in!");
    }
    if (found.checkout !== "Done") {
      notifList.push("⚠️ Check-out period is active - Please check-out!");
    }

    return notifList;
  };

  // Add verification warning to notifications
  const checkVerificationNotif = () => {
    const gpsVerified = localStorage.getItem("gps_verified") === "true";
    const wifiVerified = localStorage.getItem("wifi_verified") === "true";
    
    let notifList = [];
    if (!gpsVerified) {
      notifList.push("📍 Please verify your GPS location");
    }
    if (!wifiVerified) {
      notifList.push("📶 Please verify your WiFi connection");
    }
    return notifList;
  };

  // Cek otomatis saat halaman dibuka
  useEffect(() => {
    const verificationNotifs = checkVerificationNotif();
    const attendanceNotifs = checkAttendanceNotif();
    const currentUser = localStorage.getItem("current_user");
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const userAccount = accounts.find(acc => acc.username === currentUser);
    
    let notifications = [
      ...verificationNotifs,
      ...attendanceNotifs,
    ];

    // Add prominent verification reminder for new users
    if (userAccount?.isNewUser) {
      notifications.unshift("🔔 New User: Please complete your GPS and WiFi verification!");
    }

    setNotifications(notifications);

    if (verificationNotifs.length > 0 || userAccount?.isNewUser) {
      setShowAutoNotif(true);
      setTimeout(() => setShowAutoNotif(false), 3000);
    }
  }, []);

  // Show notification every 5 minutes if not checked in/out
  useEffect(() => {
    const checkAndNotify = () => {
      const notifs = checkAttendanceNotif();
      if (notifs.length > 0) {
        setShowAutoNotif(true);
        setTimeout(() => setShowAutoNotif(false), 3000);
      }
    };

    // Check immediately and then every 5 minutes
    checkAndNotify();
    const interval = setInterval(checkAndNotify, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setIsProfileOpen(false);
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery) {
      const foundPage = pages.find(page => 
        page.name.toLowerCase().includes(searchQuery)
      );
      if (foundPage) {
        navigate(foundPage.path);
        setSearchQuery("");
      }
    }
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

  // Define available pages for search
  const pages = [
    { name: "Dashboard", path: "/" },
    { name: "Verification", path: "/verification" },
    { name: "Check-in & Check-out", path: "/checkin-checkout" },
    { name: "Attendance History", path: "/history" }
  ];

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between z-20 relative">
      {/* Left: App Name */}
      <h1 className="text-xl font-bold text-gray-800">
        Absen<span className="text-blue-600">Go</span>
      </h1>

      {/* Center: Search Bar */}
      <div className="flex-1 ml-64 relative">
        <input
          type="text"
          placeholder="Search pages (Dashboard, Verification, Check-in, History)..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {/* Dropdown results */}
        {searchQuery && (
          <div className="absolute top-full left-0 w-full max-w-md mt-1 bg-white border rounded-md shadow-lg z-50">
            {pages
              .filter(page => 
                page.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((page, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(page.path);
                    setSearchQuery("");
                  }}
                >
                  {page.name}
                </div>
              ))}
          </div>
        )}
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
