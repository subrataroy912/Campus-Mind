import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X, Loader2, Search } from "lucide-react";

import BrandLogo from "../../../components/common/BrandLogo";
import Sidebar from "./Sidebar.jsx";
import { initials } from "@/utils/initials";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi";
import { useAuth } from "@/context/AuthContext.jsx";
import NotificationsMenu from "@/features/notifications/components/NotificationsMenu.jsx";
import { routes } from "@/routes/paths";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/components/common/LogoutButton";

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authStatus } = useAuth();

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
      <div className="flex items-center gap-1 sm:gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="relative z-50 rounded-lg text-text-main hover:bg-canvas md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        <BrandLogo
          fetchPriority="high"
          to={routes.dashboard}
          className="z-50"
        />
      </div>

      <div className="relative hidden w-full items-center md:flex md:w-75 lg:w-100">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background py-2 pl-8 shadow-none"
        />
      </div>

      {/* User Profile and Logout */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg md:hidden text-text-main hover:bg-canvas"
          aria-label="Open search"
        >
          <Search size={20} />
        </Button>
        <NotificationsMenu />
        <Link
          to={routes.profile.root}
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
        <LogoutButton />
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed left-0 top-0 z-50 flex h-dvh w-[18rem] max-w-[85vw] flex-col bg-surface shadow-xl md:hidden">
            <div className="flex h-16 shrink-0 items-center justify-between gap-1 border-b border-border px-2 sm:gap-1">
              <BrandLogo fetchPriority="high" to={routes.dashboard} />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-text-main hover:bg-canvas"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
              >
                <X size={20} />
              </Button>
            </div>

            <Sidebar
              isAbsolute="flex-1 w-full overflow-y-auto border-r-0"
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </>
      )}
    </header>
  );
}
