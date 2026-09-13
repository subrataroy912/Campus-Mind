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

export default function ClassListPage() {
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
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Your Learning Spaces</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
            Classes
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            All the classrooms you are currently enrolled in or instructing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            to={routes.classes.join}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Ticket size={16} aria-hidden="true" />
            <span>Join with code</span>
          </Button>
          {user?.canCreateCourses && (
            <Button
              to={routes.classes.new}
              size="sm"
              className="gap-1.5"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Create class</span>
            </Button>
          )}
        </div>
      </header>

      <section className="mt-8">
        {status === "error" ? (
          <EmptyState
            title="We could not load your classes"
            description="Please refresh the page and try again."
          />
        ) : classrooms.length === 0 ? (
          <EmptyState
            title="You haven't joined any classes yet"
            description="Join an existing class with an invite code or browse public courses."
            action={{ to: routes.classes.join, label: "Join a class" }}
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
