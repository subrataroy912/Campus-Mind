import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, LogOut } from "lucide-react";

import BrandLogo from "../../../components/common/BrandLogo";
import Sidebar from "./Sidebar.jsx";
import { initials } from "@/utils/initials";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi";
import { useAuth } from "@/context/AuthContext.jsx";
import { logoutFromHeader } from "./headerLogout.js";
import NotificationsMenu from "@/features/notifications/components/NotificationsMenu.jsx";
import { routes } from "@/routes/paths";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

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
    <header className="relative z-40 flex h-12 items-center justify-between gap-1 border-b border-border bg-surface px-2 sm:gap-2 sm:px-4">
      {/* Grouped Menu Button and Logo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>

        <BrandLogo fetchPriority="high" to={routes.dashboard} />
      </div>

      {/* User Profile and Logout */}
      <div className="flex shrink-0 items-center gap-1">
        <NotificationsMenu />
        <Link
          to={routes.profile.root}
          className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-text-main transition-colors hover:bg-canvas"
        >
          {isLoading ? (
            <Skeleton className="h-7 w-7 rounded-full" />
          ) : (
            <Avatar className="h-7 w-7">
              <AvatarImage
                src={safeAvatarUrl}
                alt={`${profile?.displayName || "User"}'s avatar`}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <AvatarFallback className="bg-accent/20 text-xs font-bold uppercase text-primary">
                {profile?.displayName ? initials(profile.displayName) : "U"}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="hidden sm:inline">
            {isLoading ? "Loading..." : profile?.displayName || "Profile"}
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-muted hover:text-text-main"
          onClick={() => logoutFromHeader(logout, navigate)}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={15} aria-hidden="true" />
        </Button>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-12 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed left-0 top-12 z-50 md:hidden">
            <Sidebar
              isAbsolute="h-[calc(100dvh-3rem)] w-[17rem] max-w-[85vw] shadow-lg overflow-y-auto bg-surface"
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </>
      )}
    </header>
  );
}
