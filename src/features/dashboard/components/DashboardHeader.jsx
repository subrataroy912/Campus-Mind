import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { selectIsMobileMenuOpen } from "@/features/ui/uiSelectors.js";
import { setMobileMenuOpen } from "@/features/ui/uiSlice.js";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle.jsx";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuOpen = useSelector(selectIsMobileMenuOpen);
  const setMenuOpen = (val) => {
    const nextVal = typeof val === "function" ? val(menuOpen) : val;
    dispatch(setMobileMenuOpen(nextVal));
  };
  const { authStatus, logout } = useAuth();
  const { data: profile, isLoading } = useGetCurrentProfileQuery(undefined, {
    skip: authStatus === "hydrating",
  });

  const safeAvatarUrl =
    typeof profile?.avatarUrl === "string" && profile.avatarUrl.trim()
      ? profile.avatarUrl.trim()
      : null;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <header className="relative z-40 flex h-14 items-center justify-between gap-2 border-b border-border/70 bg-card/95 px-3 backdrop-blur-md sm:px-4">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="min-h-10 min-w-10 sm:h-8 sm:w-8 md:hidden text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>

        <BrandLogo fetchPriority="high" to={routes.dashboard} />
      </div>

      {/* Right: User Profile and Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        <NavbarSearch />
        <ThemeToggle />
        <NotificationsMenu />

        <div className="h-4 w-px bg-border/60 mx-0.5" aria-hidden="true" />

        <Link
          to={routes.profile.root}
          className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
        >
          {isLoading ? (
            <Skeleton className="h-6 w-6 rounded-full" />
          ) : (
            <Avatar className="h-6 w-6 ring-1 ring-border/50">
              <AvatarImage
                src={safeAvatarUrl}
                alt={`${profile?.displayName || "User"}'s avatar`}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-[10px] font-bold uppercase text-primary">
                {profile?.displayName ? initials(profile.displayName) : "U"}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="hidden sm:inline text-xs font-medium text-foreground truncate max-w-[120px]">
            {isLoading ? "Loading..." : profile?.displayName || "Profile"}
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="min-h-9 min-w-9 sm:h-7 sm:w-7 text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
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
            className="fixed inset-0 top-14 z-40 bg-black/50 backdrop-blur-xs md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed left-0 top-14 z-50 md:hidden">
            <Sidebar
              isAbsolute="h-[calc(100dvh-3.5rem)] w-60 max-w-[85vw] shadow-xl overflow-y-auto bg-card border-r border-border"
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </>
      )}
    </header>
  );
}
