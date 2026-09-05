import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogOut, Menu, UserRound, X } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import BrandLogo from "./../common/BrandLogo.jsx";
import Sidebar from "./Sidebar.jsx";

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const leave = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="relative flex min-h-16 items-center justify-between border-b border-border bg-surface px-3 sm:px-6">
      <button
        className="rounded-lg p-2 text-text-main hover:bg-canvas md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        ref={buttonRef}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <BrandLogo />

      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-text-main hover:bg-canvas"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-primary">
            <UserRound size={17} />
          </span>
          <span className="hidden sm:inline">{user?.name || "Profile"}</span>
        </Link>
        <button
          onClick={leave}
          className="rounded-lg p-2 text-text-muted hover:bg-canvas hover:text-primary"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {menuOpen && (
        <div ref={sidebarRef}>
          <Sidebar
            isAbsolute="absolute left-0 top-16 h-[calc(100vh-4rem)] shadow-lg"
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
