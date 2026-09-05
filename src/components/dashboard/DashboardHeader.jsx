import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogOut, Menu, UserRound, X } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import BrandLogo from "./../common/BrandLogo.jsx";
import Sidebar from "./Sidebar.jsx";

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <Sidebar
            isAbsolute="absolute left-0 top-16 h-[calc(100vh-4rem)] shadow-lg"
            onNavigate={() => setMenuOpen(false)}
          />
        </>
      )}
    </header>
  );
}
