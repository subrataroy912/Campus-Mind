import { useMemo } from "react";
import { Compass, Loader2 } from "lucide-react";
import { Link } from "react-router";

import { useDashboardData } from "../useDashboardData.js";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi.js";

export default function DashboardHomePage() {
  const { data: profile, isLoading, error } = useGetCurrentProfileQuery();
  const {
    classrooms = [],
    exploreClassrooms = [],
    status,
  } = useDashboardData();

  const feedClasses = useMemo(() => {
    const joinedCodes = new Set(classrooms.map((classroom) => classroom.code));

    const available = exploreClassrooms.filter(
      (classroom) => !joinedCodes.has(classroom.code),
    );

    return [...available]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
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
            <Link to="/dashboard/classes">See all</Link>
          </span>
        </div>

        {status === "error" ? (
          <EmptyState
            title="We could not load your classes"
            description="Please refresh the page and try again."
          />
        ) : classrooms.length > 0 ? (
          <ContentList
            layout="carousel"
            items={classrooms}
            renderItem={(classroom) => <ClassCard classroom={classroom} />}
          />
        ) : (
          <EmptyState
            title="Your class list is ready for you"
            description="Create a class for your group or join one with a code."
            action={{ to: "/dashboard/class/join", label: "Join a class" }}
          />
        )}
      </section>

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="explore-feed-heading"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Compass size={18} aria-hidden="true" />
              <p className="text-sm font-semibold">Class feed</p>
            </div>
            <h2
              id="explore-feed-heading"
              className="mt-1 text-xl font-semibold text-text-heading"
            >
              Find your next learning space
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Explore popular classes and recommendations selected for you.
            </p>
          </div>
          <Link
            to="/dashboard/explore"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </Link>
        </div>

        {status === "error" ? (
          <div className="mt-6">
            <EmptyState
              title="We could not load the class feed"
              description="Please check your connection or try again later."
            />
          </div>
        ) : feedClasses.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feedClasses.map((classroom) => (
              <div key={classroom.code || classroom.id}>
                <ExploreClassCard classroom={classroom} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="You are all caught up"
              description="There are no more classes to show in this part of the feed."
            />
          </div>
        )}
      </section>
    </div>
  );
}
