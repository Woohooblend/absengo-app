import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Dikembalikan
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const { setIsLoggedIn } = useAuth(); // Dikembalikan
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Dikembalikan

  const profileRef = useRef(null); // Dikembalikan
  const notificationRef = useRef(null);

  const handleLogout = () => { // Dikembalikan
    setIsLoggedIn(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setIsProfileOpen(false);
  };

  const toggleProfileMenu = () => { // Dikembalikan
    setIsProfileOpen((prev) => !prev);
    setShowNotifications(false);
  };

  // Efek untuk menutup dropdown jika klik terjadi di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Logika untuk profil dikembalikan
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
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-md shadow-lg">
              <div className="p-4 border-b font-semibold text-gray-700">
                Notifications
              </div>
              <ul className="max-h-60 overflow-y-auto divide-y text-sm text-gray-700">
                <li className="p-3 hover:bg-gray-100 cursor-pointer">
                  🕘 Class "OOP" starts in 30 minutes
                </li>
                <li className="p-3 hover:bg-gray-100 cursor-pointer">
                  📋 10 students haven't checked in yet
                </li>
                <li className="p-3 hover:bg-gray-100 cursor-pointer">
                  📢 New announcement from Prof. Linda
                </li>
              </ul>
              <div className="p-3 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                View all notifications
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown DIKEMBALIKAN dan DIMODIFIKASI */}
        <div className="relative" ref={profileRef}>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
            onClick={toggleProfileMenu}
          />
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
              
              {/* OPSI "PROFILE" SUDAH DIHAPUS DARI SINI */}

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
    </header>
  );
};

export default Header;
