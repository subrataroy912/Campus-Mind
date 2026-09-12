import { useMemo } from "react";
import { Compass, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { useDashboardData } from "../useDashboardData.js";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function DashboardHomePage() {
  const { authStatus } = useAuth();
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

  const displayExploreCards = useMemo(() => {
    const joinedCourseIds = new Set(
      classrooms.map(
        (classroom) =>
          classroom.id || classroom.courseId || classroom.classId
      )
    );

    // Prioritize unjoined public courses, followed by joined public courses from the database
    const unjoined = exploreClassrooms.filter(
      (c) =>
        !joinedCourseIds.has(c.courseId || c.id || c.classId)
    );
    const joined = exploreClassrooms.filter(
      (c) =>
        joinedCourseIds.has(c.courseId || c.id || c.classId)
    );

    return [...unjoined, ...joined].slice(0, 4);
  }, [classrooms, exploreClassrooms]);

  // Handle global loading states for both dashboard data and profile
  if (status === "loading" || status === "idle" || isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle profile fetch errors
  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <EmptyState
          title="We could not load your profile"
          description="Please check your connection or refresh the page."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          Your learning space
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
          Welcome back, {profile?.displayName?.split(" ")[0] || "there"}.
        </h1>
        <p className="mt-2 max-w-2xl text-text-muted">
          Keep up with your classes, then discover a new space to learn with the
          CampusMind community.
        </p>
      </header>

      {classrooms.length > 0 && (
        <section className="mt-8" aria-labelledby="my-classes-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2
                id="my-classes-heading"
                className="text-xl font-semibold text-text-heading"
              >
                My classes
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Your enrolled learning spaces.
              </p>
            </div>
            <span className="text-sm text-text-muted">
              <Link to="/dashboard/profile?tab=classes">See all</Link>
            </span>
          </div>

          {status === "error" ? (
            <EmptyState
              title="We could not load your classes"
              description="Please refresh the page and try again."
            />
          ) : (
            <ContentList
              layout="carousel"
              items={classrooms}
              renderItem={(classroom) => <ClassCard classroom={classroom} />}
            />
          )}
        </section>
      )}

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="explore-feed-heading"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400 mt-0.5 shrink-0">
              <Compass size={18} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="explore-feed-heading"
                className="text-xl font-bold tracking-tight text-text-heading"
              >
                Discover something new
              </h2>
              <p className="mt-0.5 text-sm text-text-muted">
                Explore popular topics to grow your skills.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-text-heading hover:text-primary transition-colors"
          >
            <span>See all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {status === "error" ? (
          <div className="mt-6">
            <EmptyState
              title="We could not load the class feed"
              description="Please check your connection or try again later."
            />
          </div>
        ) : displayExploreCards.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayExploreCards.map((classroom) => (
              <div key={classroom.courseId || classroom.id}>
                <ExploreClassCard classroom={classroom} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No public classes available"
              description="There are currently no public classes to explore. Create a class to get started!"
            />
          </div>
        )}
      </section>
    </div>
  );
}
