import { useMemo } from "react";
import {
  Loader2,
  CompassIcon,
  Sparkles,
  Flame,
} from "lucide-react";

import { useDashboardData } from "../useDashboardData.js";
import EmptyState from "@/components/common/EmptyState.jsx";
import ClassCard from "@/features/classroom/components/ClassCard.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import { CampusLiveLounge } from "../components/CampusLiveLounge.jsx";
import { CampusLeaderboardWidget } from "../components/CampusLeaderboardWidget.jsx";
import { StudyBuddiesWidget } from "../components/StudyBuddiesWidget.jsx";
import { useGetCurrentProfileQuery } from "@/features/profile/api/profileApi.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import { DashboardSection } from "../components/DashboardSection.jsx";

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
      <header className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between md:gap-6">
  {/* Left Side */}
  <div className="min-w-0 max-w-xl">
    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
      Your learning space
    </p>

    <h1 className="mt-1 text-xl font-bold tracking-tight text-text-heading sm:text-2xl md:text-3xl">
      Welcome back,
      <br className="block sm:hidden" /> {greetingName}.
    </h1>

    <p className="mt-2 max-w-lg text-xs leading-relaxed text-text-muted sm:text-sm">
      Keep up with your spaces, then discover a new space to connect with
      the CampusMind community.
    </p>
  </div>

  {/* Illustration */}
  <div className="mx-auto w-32 shrink-0 sm:w-40 md:mx-0 md:w-44 lg:w-48">
    <img
      src="/images/dashboard-welcome.svg"
      alt="CampusMind Welcome"
      className="h-auto w-full object-contain"
    />
  </div>
</header>

      {/* Live Campus Study Lounge */}
      <div className="mt-5 sm:mt-6">
        <CampusLiveLounge />
      </div>

      {/* Peer Connections & Weekly Leaderboard */}
      <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CampusLeaderboardWidget />
        <StudyBuddiesWidget />
      </div>

      {classrooms.length > 0 && (
        <DashboardSection
          id="my-classes-heading"
          title="My spaces"
          description="Your joined learning and campus spaces."
          linkTo={routes.spaces.list}
          status={status}
          items={classrooms}
          renderItem={(classroom, index) => (
            <ClassCard classroom={classroom} priority={index === 0} />
          )}
          errorTitle="We could not load your spaces"
          errorDescription="Please refresh the page and try again."
          className="mt-5 pt-0 sm:mt-6 sm:pt-0"
        />
      )}

      <DashboardSection
        id="explore-feed-heading"
        title="Discover something new"
        description="Explore popular topics and groups to grow your skills."
        icon={CompassIcon}
        iconWrapperClass="bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400"
        linkTo={routes.explore}
        status={status}
        items={displayExploreCards}
        renderItem={(space, index) => (
          <ExploreClassCard classroom={space} priority={index === 0} />
        )}
        errorTitle="We could not load the spaces feed"
        errorDescription="Please check your connection or try again later."
        emptyTitle="No public spaces available"
        emptyDescription="There are currently no public spaces to explore. Create a space to get started!"
        className="border-t border-border"
      />
      <DashboardSection
        id="recommended-spaces-heading"
        title="Recommended for you"
        description="Hand-picked spaces based on your interests and activity."
        icon={Sparkles}
        iconWrapperClass="bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
        linkTo={routes.explore}
        status={status}
        items={displayExploreCards}
        renderItem={(space, index) => (
          <ExploreClassCard classroom={space} priority={index === 0} />
        )}
        errorTitle="We could not load recommendations"
        errorDescription="Please check your connection or try again later."
        emptyTitle="No personalized recommendations yet"
        emptyDescription="Join a few spaces and interact with the community to get tailored suggestions!"
        className="border-t border-border"
      />

      <DashboardSection
        id="trending-spaces-heading"
        title="Trending right now"
        description="Spaces with the most active discussions this week."
        icon={Flame}
        iconWrapperClass="bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
        linkTo={routes.explore}
        status={status}
        items={displayExploreCards}
        renderItem={(space, index) => (
          <ExploreClassCard classroom={space} priority={index === 0} />
        )}
        errorTitle="Could not load trending spaces"
        emptyTitle="Nothing is trending right now"
        emptyDescription="Be the first to start a conversation in your spaces!"
        className="border-t border-border"
      />
    </div>
  );
}
