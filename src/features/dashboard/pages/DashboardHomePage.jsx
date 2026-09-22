import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { useDashboardData } from "../hooks/useDashboardData.js";
import EmptyState from "@/components/common/EmptyState.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import { DashboardSection } from "../components/DashboardSection.jsx";
import WelcomeModal from "../components/WelcomeModal.jsx";
import DashboardSkeleton from "../components/DashboardSkeleton.jsx";

export default function DashboardHomePage() {
  const { user, authStatus } = useAuth();
  const {
    data: profile,
    isLoading,
    error,
  } = useGetCurrentProfileQuery(undefined, {
    skip: authStatus === "hydrating",
  });

  const {
    classrooms = [],
    exploreClassrooms = [],
    status,
  } = useDashboardData();

  // Curate 3 new spaces for the home teaser safely
  const suggestedSpaces = useMemo(() => {
    if (!Array.isArray(exploreClassrooms)) return [];

    const joinedCourseIds = new Set(
      (classrooms || []).map(
        (c) => c?.id || c?.courseId || c?.classId || c?._id,
      ),
    );

    return exploreClassrooms
      .filter(
        (c) =>
          !joinedCourseIds.has(c?.courseId || c?.id || c?.classId || c?._id),
      )
      .slice(0, 3);
  }, [classrooms, exploreClassrooms]);

  // Loading skeleton screen
  if (status === "loading" || status === "idle" || isLoading) {
    return <DashboardSkeleton />;
  }

  // Error boundary fallback
  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <EmptyState
          title="We could not load your profile"
          description="Please check your connection or refresh the page."
        />
      </div>
    );
  }

  const firstName = profile?.displayName?.split(" ")[0];
  const title =
    profile?.gender?.toLowerCase() === "male"
      ? "Mr. "
      : profile?.gender?.toLowerCase() === "female"
        ? "Mrs. "
        : "";
  const greetingName = firstName ? `${title}${firstName}` : "there";
  const activeUserId = profile?.id || profile?._id || user?.id;

  return (
    <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
      {/* 1. One-Time Login Greeting Dialog (only for fresh profile or 3-4 days away) */}
      <WelcomeModal
        greetingName={greetingName}
        userId={activeUserId}
        isLongTimeAway={user?.isLongTimeAway}
      />

      {/* 2. Primary Section: My Spaces */}
      <DashboardSection
        id="my-classes-heading"
        title="My spaces"
        description="Your active learning and campus spaces."
        linkTo={routes.spaces.list}
        status={status}
        items={classrooms}
        renderItem={(classroom, index) => (
          <ClassCard classroom={classroom} priority={index === 0} />
        )}
        errorTitle="We could not load your spaces"
        errorDescription="Please refresh the page and try again."
        emptyTitle="No enrolled spaces yet"
        emptyDescription="Explore spaces below to join courses and groups."
      />

      {/* 3. Compact Suggested Shelf */}
      {suggestedSpaces.length > 0 && (
        <section className="flex flex-col gap-2 rounded-lg border border-border/70 bg-card/60 p-3 shadow-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              <h2 className="text-xs font-semibold tracking-tight text-foreground">
                Suggested for you
              </h2>
              <span className="hidden text-[11px] text-muted-foreground sm:inline">
                · Explore new communities
              </span>
            </div>

            <Link
              to={routes.explore}
              className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <span>Explore all</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedSpaces.map((space, idx) => (
              <ExploreClassCard
                key={space?.id || space?.courseId || space?._id || idx}
                classroom={space}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
