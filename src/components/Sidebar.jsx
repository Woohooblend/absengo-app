import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Verification", path: "/verification" },
    { name: "Check-in & Check-out", path: "/checkin-checkout" },
    { name: "Attendance History", path: "/history" },
  ];

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
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-700 text-sm"
            >
              {/* Bisa tambahkan ikon di sini jika diperlukan */}
              {open && <span className="truncate">{item.name}</span>}
              {!open && <span className="sr-only">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
