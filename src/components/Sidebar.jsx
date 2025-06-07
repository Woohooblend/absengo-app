import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white ${open ? "w-64" : "w-16"} min-h-screen transition-all duration-300`}>
        <nav className="space-y-2 p-4">
          <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
            Settings
          </Link>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
