import { Link } from "react-router";
import { Plus, Ticket, Loader2 } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "../../classroom/components/ClassCard.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths.js";

export default function SpaceListPage() {
  const { user } = useAuth();

  const { classrooms = [], status } = useDashboardData({
    includeExplore: false,
  });

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
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
        ) : (
          <ContentList
            layout="grid"
            items={classrooms}
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
          />
        )}
      </section>
    </div>
  );
}
