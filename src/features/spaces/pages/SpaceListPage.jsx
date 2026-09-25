import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useSelector } from "react-redux";
import {
  Plus,
  Ticket,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import SpaceCard from "@/features/spaces/components/SpaceCard.jsx";
import CompactSpaceRow from "@/features/spaces/components/CompactSpaceRow.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import SpaceListSkeleton from "@/features/spaces/components/SpaceListSkeleton.jsx";
import {
  selectCreatedSpaces,
  selectJoinedSpaces,
} from "@/features/spaces/classroomSelectors.js";
import {
  getSavedSpacesViewMode,
  isSpaceOwner,
  saveSpacesViewMode,
} from "@/features/spaces/utils/roles.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/routes/paths.js";
import { cn } from "@/lib/utils.js";

export default function SpaceListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(getSavedSpacesViewMode);

  const handleViewModeToggle = (mode) => {
    setViewMode(mode);
    saveSpacesViewMode(mode);
  };

  const { classrooms = [], status } = useDashboardData({
    includeExplore: false,
  });

  const memoizedCreated = useSelector((state) =>
    selectCreatedSpaces(state, user?.id)
  );
  const memoizedJoined = useSelector((state) =>
    selectJoinedSpaces(state, user?.id)
  );

  const createdSpaces = useMemo(() => {
    if (memoizedCreated && memoizedCreated.length > 0) return memoizedCreated;
    return classrooms.filter((c) => isSpaceOwner(c, user?.id));
  }, [memoizedCreated, classrooms, user?.id]);

  const joinedSpaces = useMemo(() => {
    if (memoizedJoined && memoizedJoined.length > 0) return memoizedJoined;
    return classrooms.filter((c) => !isSpaceOwner(c, user?.id));
  }, [memoizedJoined, classrooms, user?.id]);

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

  const isLoadingSpaces =
    (status === "loading" || status === "idle") && classrooms.length === 0;

  const tabs = [
    { id: "all", label: "All", count: classrooms.length },
    { id: "created", label: "Created by Me", count: createdSpaces.length },
    { id: "joined", label: "Joined", count: joinedSpaces.length },
  ];

  const listRef = useRef(null);
  const [listOffset, setListOffset] = useState(0);

  useLayoutEffect(() => {
    if (listRef.current) {
      setListOffset(
        listRef.current.getBoundingClientRect().top + window.scrollY
      );
    }
  }, [filteredSpaces.length, viewMode, isLoadingSpaces, status]);

  const virtualizer = useWindowVirtualizer({
    count: filteredSpaces.length,
    estimateSize: () => 64, // estimated pixel height of CompactSpaceRow
    overscan: 10,
    scrollMargin: listOffset,
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-8 min-w-0">
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

        <div className="flex flex-wrap items-center gap-2">
          <Button
            to={routes.classes.join}
            variant="outline"
            size="sm"
            className="min-h-9 sm:h-7.5 gap-1.5 text-xs rounded-lg border-border/70"
          >
            <Ticket size={13} aria-hidden="true" />
            <span>Join with code</span>
          </Button>
          {(user?.canCreateCourses || user?.isAdmin) && (
            <Button
              to={routes.spaces.new}
              size="sm"
              className="min-h-9 sm:h-7.5 gap-1.5 text-xs rounded-lg font-semibold"
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
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex h-auto items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1 text-xs transition-all cursor-pointer",
                  isActive
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60 hover:bg-card"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium",
                )}
              >
                <span>{tab.label}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-auto rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </Badge>
              </Button>
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
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spaces…"
              className="h-8 w-full rounded-lg border border-border/60 bg-card pl-8 pr-7 text-base sm:text-xs text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex min-h-8 min-w-8 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={13} />
              </Button>
            )}
          </div>

          {/* View Mode Toggle: Dense List vs Grid */}
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/50 p-0.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleViewModeToggle("list")}
              aria-label="List view"
              title="Dense list view"
              className={cn(
                "flex min-h-8 min-w-8 sm:h-7 sm:w-7 items-center justify-center rounded-md transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-card text-foreground shadow-2xs border border-border/50 hover:bg-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List size={14} aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleViewModeToggle("grid")}
              aria-label="Grid view"
              title="Card grid view"
              className={cn(
                "flex min-h-8 min-w-8 sm:h-7 sm:w-7 items-center justify-center rounded-md transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-2xs border border-border/50 hover:bg-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Spaces Listing Content */}
      <section className="pt-1">
        <AsyncStateBoundary
          isLoading={isLoadingSpaces}
          hasData={filteredSpaces.length > 0}
          error={
            status === "error" ? "Please refresh the page and try again." : null
          }
          errorTitle="We could not load your spaces"
          loadingFallback={<SpaceListSkeleton viewMode={viewMode} />}
          isEmpty={classrooms.length === 0 || filteredSpaces.length === 0}
          emptyFallback={
            classrooms.length === 0 ? (
              <EmptyState
                title="You haven't joined any spaces yet"
                description="Join an existing space with an invite code or create a space."
                action={{ to: routes.classes.join, label: "Join a space" }}
              />
            ) : searchQuery.trim() ? (
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
          }
        >
          {viewMode === "list" ? (
            /* High-Density Horizontal Row Stack (~56px height) */
            <div
              ref={listRef}
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const classroom = filteredSpaces[virtualRow.index];
                return (
                  <div
                    key={classroom.id || classroom.courseId}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - virtualizer.options.scrollMargin
                      }px)`,
                      paddingBottom: "8px", // gap equivalent
                    }}
                  >
                    <CompactSpaceRow classroom={classroom} />
                  </div>
                );
              })}
            </div>
          ) : (
            /* Card Grid View */
            <ContentList
              layout="grid"
              items={filteredSpaces}
              renderItem={(classroom) => <SpaceCard classroom={classroom} />}
            />
          )}
        </AsyncStateBoundary>
      </section>
    </div>
  );
}
