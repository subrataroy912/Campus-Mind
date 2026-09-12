import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, Loader2, LogOut } from "lucide-react";

import BrandLogo from "../../../components/common/BrandLogo";
import Sidebar from "./Sidebar.jsx";
import { initials } from "@/utils/initials";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi";
import { useAuth } from "@/context/AuthContext.jsx";
import { logoutFromHeader } from "./headerLogout.js";
import NotificationsMenu from "@/features/notifications/components/NotificationsMenu.jsx";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { authStatus, logout } = useAuth();
  const { data: profile, isLoading } = useGetCurrentProfileQuery(undefined, {
    skip: authStatus === "hydrating",
  });

  const safeAvatarUrl =
    typeof profile?.avatarUrl === "string" && profile.avatarUrl.trim()
      ? profile.avatarUrl.trim()
      : null;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <header className="relative z-40 flex h-16 items-center justify-between gap-1 border-b border-border bg-surface px-2 sm:gap-3 sm:px-6">
      {/* Grouped Menu Button and Logos */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className="relative z-50 rounded-lg p-2 text-text-main hover:bg-canvas md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="sm:hidden">
          <BrandLogo compact fetchPriority="high" />
        </div>
        <div className="hidden sm:inline-flex">
          <BrandLogo fetchPriority="high" />
        </div>
      </div>

      {/* User Profile and Logout */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <NotificationsMenu />
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-text-main transition-colors hover:bg-canvas"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-primary">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : safeAvatarUrl ? (
              <img
                src={safeAvatarUrl}
                alt={`${profile?.displayName || "User"}'s avatar`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-sm font-bold uppercase">
                {profile?.displayName ? initials(profile.displayName) : "U"}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">
            {isLoading ? "Loading..." : profile?.displayName || "Profile"}
          </span>
        </Link>
        <button
          onClick={() => logoutFromHeader(logout, navigate)}
          aria-label="Sign out"
          title="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-canvas hover:text-text-main cursor-pointer"
        >
          <LogOut size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed left-0 top-16 z-50 md:hidden">
            <Sidebar
              isAbsolute="h-[calc(100dvh-4rem)] w-[18rem] max-w-[85vw] shadow-lg overflow-y-auto bg-surface"
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </>
      )}
    </header>
  );
}
