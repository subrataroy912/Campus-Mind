import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogOut, Menu, X } from "lucide-react"; // Removed unused UserRound

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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

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
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Cleanup scroll lock on unmount
      document.body.style.overflow = "unset"; 
    };
  }, [menuOpen]);

  const leave = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="relative flex min-h-16 items-center justify-between gap-1 border-b border-border bg-surface px-2 sm:gap-3 sm:px-6 z-40">
      
      {/* Grouped Menu Button and Logos */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className="relative z-50 rounded-lg p-2 text-text-main hover:bg-canvas md:hidden"
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

      {/* User Profile and Logout */}
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

      
      {menuOpen && (
        <>
          {/* Backdrop/Overlay */}
          <div 
            className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar Container */}
          <div ref={sidebarRef} className="absolute z-50">
            <Sidebar
              isAbsolute="absolute left-0 top-16 h-[calc(100dvh-4rem)] w-[18rem] max-w-[85vw] shadow-lg"
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </>
      )}
    </header>
  );
}
