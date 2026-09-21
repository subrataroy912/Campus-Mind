import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Plus, Ticket, Loader2, Filter } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "../components/ClassCard.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths.js";

const FILTER_OPTIONS = [
  { value: "ALL", label: "All Spaces" },
  { value: "ACADEMIC_CLASS", label: "Classes" },
  { value: "STUDY_GROUP", label: "Study Groups" },
  { value: "CLUB_SOCIETY", label: "Clubs" },
  { value: "PROJECT_TEAM", label: "Projects" },
  { value: "COMMUNITY_HUB", label: "Community" },
];

export default function SpaceListPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("ALL");

  const { classrooms = [], status } = useDashboardData({
    includeExplore: false,
  });

  const filteredSpaces = useMemo(() => {
    if (selectedType === "ALL") return classrooms;
    return classrooms.filter((c) => (c.spaceType || "ACADEMIC_CLASS") === selectedType);
  }, [classrooms, selectedType]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-5 space-y-3.5">
      {/* Header Bar */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

      {/* Filter Tabs - Compact High-Density Pills */}
      {classrooms.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {FILTER_OPTIONS.map((opt) => {
            const count =
              opt.value === "ALL"
                ? classrooms.length
                : classrooms.filter((c) => (c.spaceType || "ACADEMIC_CLASS") === opt.value).length;
            if (opt.value !== "ALL" && count === 0) return null;

            const isSelected = selectedType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                    : "bg-muted/40 text-muted-foreground border border-border/60 hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Space Cards Grid */}
      <section>
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
          <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-xs text-text-muted">
            No spaces found in this category.
          </div>
        ) : (
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
