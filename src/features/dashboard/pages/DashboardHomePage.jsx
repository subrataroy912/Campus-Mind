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
import { routes } from "@/routes/paths.js";
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
        (classroom) => classroom.id || classroom.courseId || classroom.classId
      )
    );

    // Prioritize unjoined public courses, followed by joined public courses from the database
    const unjoined = exploreClassrooms.filter(
      (c) => !joinedCourseIds.has(c.courseId || c.id || c.classId)
    );
    const joined = exploreClassrooms.filter((c) =>
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
  const firstName = profile?.displayName?.split(" ")[0];
  const title =
    profile?.gender?.toLowerCase() === "male"
      ? "Mr. "
      : profile?.gender?.toLowerCase() === "female"
      ? "Mrs. "
      : "";

  const greetingName = firstName ? `${title}${firstName}` : "there";

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-5">
      <header className="flex items-center justify-between rounded-2xl bg-surface p-6 shadow-sm">
        {/* Left Side: Your Text */}
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Your learning space
          </p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-text-heading sm:text-3xl">
            Welcome back, <br className="block sm:hidden" /> {greetingName}.
          </h1>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            Keep up with your spaces, then discover a new space to connect with
            the CampusMind community.
          </p>
        </div>

        <div className=" md:block md:w-38">
          <img
            src="/images/dashboard-welcome.svg"
            alt="CampusMind Welcome"
            className="h-full w-full object-contain"
          />
        </div>
      </header>

      {classrooms.length > 0 && (
        <section className="mt-5 sm:mt-6" aria-labelledby="my-classes-heading">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2
                id="my-classes-heading"
                className="text-base font-bold text-text-heading sm:text-lg"
              >
                My spaces
              </h2>
              <p className="text-[12px] text-text-muted">
                Your joined learning and campus spaces.
              </p>
            </div>
            <span className="text-xs text-text-muted hover:text-primary">
              <Link to={routes.spaces.list}>See all</Link>
            </span>
          </div>

          {status === "error" ? (
            <EmptyState
              title="We could not load your spaces"
              description="Please refresh the page and try again."
            />
          ) : (
            <ContentList
              layout="carousel"
              items={classrooms}
              renderItem={(classroom, index) => (
                <ClassCard classroom={classroom} priority={index === 0} />
              )}
            />
          )}
        </section>
      )}

      <section
        className="mt-6 border-t border-border pt-5 sm:mt-8 sm:pt-6"
        aria-labelledby="explore-feed-heading"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400 mt-0.5 shrink-0">
              <Compass size={15} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="explore-feed-heading"
                className="text-base font-bold tracking-tight text-text-heading sm:text-lg"
              >
                Discover something new
              </h2>
              <p className="text-[12px] text-text-muted">
                Explore popular topics and groups to grow your skills.
              </p>
            </div>
          </div>
          <Link
            to={routes.explore}
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-heading hover:text-primary transition-colors"
          >
            <span>See all</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {status === "error" ? (
          <div className="mt-6">
            <EmptyState
              title="We could not load the spaces feed"
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
              title="No public spaces available"
              description="There are currently no public spaces to explore. Create a space to get started!"
            />
          </div>
        )}
      </section>
    </div>
  );
}
