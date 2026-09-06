import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogOut, Menu, UserRound, X } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import BrandLogo from "../../../components/common/BrandLogo";
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
    <header className="relative flex min-h-16 items-center justify-between gap-1 border-b border-border bg-surface px-2 sm:gap-3 sm:px-6">
      
      {/* 1. Grouped Menu Button and Logos */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className="rounded-lg p-2 text-text-main hover:bg-canvas md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          ref={buttonRef}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className="sm:hidden">
          <BrandLogo compact />
        </div>
        <div className="hidden sm:inline-flex">
          <BrandLogo />
        </div>
      </div>

      {/* 2. User Profile and Logout */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-text-main hover:bg-canvas transition-colors"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/20 text-primary">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user?.name || "User"}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              // Fallback: Show the first letter of their name if no image exists
              <span className="font-bold text-sm uppercase">
                {user?.name ? user.name.charAt(0) : "U"}
              </span>
            )}
          </span>
          <span className="hidden sm:inline">{user?.name || "Profile"}</span>
        </Link>

        <button
          onClick={leave}
          className="rounded-lg p-2 text-text-muted hover:bg-canvas hover:text-primary transition-colors"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {menuOpen && (
        <div ref={sidebarRef} className="absolute">
          <Sidebar
            isAbsolute="absolute left-0 top-16 h-[calc(100dvh-4rem)] w-[18rem] max-w-[85vw] shadow-lg"
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
      }
