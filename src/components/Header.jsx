import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between z-10">
      {/* Left: App Name */}
      <h1 className="text-xl font-bold text-gray-800">MyApp</h1>

        {/* Center: Search Bar */}
      <div className="flex-1 ml-64"> {/* 👈 offset the search bar by sidebar width */}
        <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>


      {/* Right: Notification + Profile */}
      <div className="flex items-center gap-6 relative">
        {/* Notification Bell */}
        <button className="relative text-gray-600 hover:text-gray-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative group">
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
          />
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-10">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
