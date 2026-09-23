import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Plus,
  Ticket,
  Loader2,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import CompactSpaceRow from "@/features/classroom/components/CompactSpaceRow.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths.js";
import { cn } from "@/lib/utils.js";

const VIEW_MODE_KEY = "campus_mind_spaces_view_mode";

export default function SpaceListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(VIEW_MODE_KEY) || "list";
    }
    return "list";
  });

  const handleViewModeToggle = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {
      // storage disabled / unsupported
    }
  };

  const { classrooms = [], status } = useDashboardData({
    includeExplore: false,
  });

  const isCreatedByMe = (c) => {
    const role = String(c?.role || "").toUpperCase();
    return (
      role === "OWNER" ||
      role === "CREATED" ||
      (user?.id && c?.ownerId === user.id)
    );
  };

  const createdSpaces = useMemo(
    () => classrooms.filter(isCreatedByMe),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classrooms, user?.id],
  );

  const joinedSpaces = useMemo(
    () => classrooms.filter((c) => !isCreatedByMe(c)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classrooms, user?.id],
  );

  const currentTabItems = useMemo(() => {
    if (activeTab === "created") return createdSpaces;
    if (activeTab === "joined") return joinedSpaces;
    return classrooms;
  }, [activeTab, classrooms, createdSpaces, joinedSpaces]);

  const filteredSpaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentTabItems;
    return currentTabItems.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const subject = (c.subject || "").toLowerCase();
      const subtitle = (c.subtitle || c.section || "").toLowerCase();
      return title.includes(q) || subject.includes(q) || subtitle.includes(q);
    });
  }, [currentTabItems, searchQuery]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "all", label: "All", count: classrooms.length },
    { id: "created", label: "Created by Me", count: createdSpaces.length },
    { id: "joined", label: "Joined", count: joinedSpaces.length },
  ];

  return (
    <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
      {/* Header Bar */}
      <header className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Spaces
            </h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[11px] font-semibold text-primary">
              {classrooms.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Spaces you are enrolled in, facilitating, or leading across campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            to={routes.classes.join}
            variant="outline"
            size="sm"
            className="h-7.5 gap-1.5 text-xs rounded-lg border-border/70"
          >
            <Ticket size={13} aria-hidden="true" />
            <span>Join with code</span>
          </Button>
          {(user?.canCreateCourses || user?.isAdmin) && (
            <Button
              to={routes.spaces.new}
              size="sm"
              className="h-7.5 gap-1.5 text-xs rounded-lg font-semibold"
            >
              <Plus size={13} aria-hidden="true" />
              <span>Create space</span>
            </Button>
          )}
        </div>
      </header>

      {/* Filter Toolbar: Segmented Tabs + Search + View Mode Switcher */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-1">
        {/* Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1 border border-border/60 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1 text-xs transition-all cursor-pointer",
                  isActive
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium",
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right tools: Search Bar + View Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-60 min-w-0">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spaces…"
              className="h-8 w-full rounded-lg border border-border/60 bg-card pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Dense List vs Grid */}
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/50 p-0.5 shrink-0">
            <button
              onClick={() => handleViewModeToggle("list")}
              aria-label="List view"
              title="Dense list view"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-card text-foreground shadow-2xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List size={14} aria-hidden="true" />
            </button>
            <button
              onClick={() => handleViewModeToggle("grid")}
              aria-label="Grid view"
              title="Card grid view"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-2xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Spaces Listing Content */}
      <section className="pt-1">
        {status === "error" ? (
          <EmptyState
            title="We could not load your spaces"
            description="Please refresh the page and try again."
          />
        ) : classrooms.length === 0 ? (
          <EmptyState
            title="You haven't joined any spaces yet"
            description="Join an existing space with an invite code or create a space."
            action={{ to: routes.classes.join, label: "Join a space" }}
          />
        ) : filteredSpaces.length === 0 ? (
          searchQuery.trim() ? (
            <EmptyState
              title="No matching spaces"
              description={`No spaces found matching "${searchQuery}".`}
              action={{
                onClick: () => setSearchQuery(""),
                label: "Clear search",
              }}
            />
          ) : activeTab === "created" ? (
            <EmptyState
              title="No spaces created yet"
              description="You haven't created or led any spaces yet."
              action={
                user?.canCreateCourses || user?.isAdmin
                  ? { to: routes.spaces.new, label: "Create a space" }
                  : undefined
              }
            />
          ) : (
            <EmptyState
              title="No joined spaces"
              description="You haven't joined any spaces as a member yet."
              action={{ to: routes.classes.join, label: "Join a space" }}
            />
          )
        ) : viewMode === "list" ? (
          /* High-Density Horizontal Row Stack (~56px height) */
          <div className="flex flex-col gap-2">
            {filteredSpaces.map((classroom) => (
              <CompactSpaceRow
                key={classroom.id || classroom.courseId}
                classroom={classroom}
              />
            ))}
          </div>
        ) : (
          /* Card Grid View */
          <ContentList
            layout="grid"
            items={filteredSpaces}
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
          />
        )}
      </section>
    </div>
  );
}
