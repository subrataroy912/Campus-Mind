import React from "react";
import { Link } from "react-router";
import { Plus, Ticket, Loader2 } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "../components/ClassCard.jsx";
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your Campus Spaces</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-text-heading sm:text-3xl">
            Spaces
          </h1>
          <p className="text-xs text-text-muted sm:text-sm">
            All the spaces you are currently a member of, facilitating, or leading.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            to={routes.classes.join}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-lg"
          >
            <Ticket size={14} aria-hidden="true" />
            <span>Join with code</span>
          </Button>
          {user?.canCreateCourses && (
            <Button
              to={routes.spaces.new}
              size="sm"
              className="h-8 gap-1.5 text-xs rounded-lg"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Create space</span>
            </Button>
          )}
        </div>
      </header>

      <section className="mt-5 sm:mt-6">
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
