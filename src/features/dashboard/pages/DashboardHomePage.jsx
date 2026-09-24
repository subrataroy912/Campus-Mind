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

const SuggestedSpacesSection = ({ exploreClassrooms, classrooms }) => {
  const suggestedSpaces = useMemo(() => {
    if (!Array.isArray(exploreClassrooms) || !Array.isArray(classrooms))
      return [];

    const getId = (c) => c?.id || c?.courseId || c?.classId || c?._id;
    const joinedCourseIds = new Set(classrooms.map(getId).filter(Boolean));
    const suggestions = [];

    for (const space of exploreClassrooms) {
      if (!joinedCourseIds.has(getId(space))) {
        suggestions.push(space);
        if (suggestions.length === 3) break;
      }
    }
    return suggestions;
  }, [classrooms, exploreClassrooms]);

  if (suggestedSpaces.length === 0) return null;

  return (
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
            isEnrolled={false}
          />
        ))}
      </div>
    </section>
  );
};

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

  if (status === "loading" || status === "idle" || isLoading) {
    return <DashboardSkeleton />;
  }

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
  const genderStr = profile?.gender?.toLowerCase();

  const titlePrefix =
    genderStr === "male" ? "Mr. " : genderStr === "female" ? "Ms. " : "";
  const greetingName = firstName ? `${titlePrefix}${firstName}` : "there";

  const activeUserId = profile?.id || profile?._id || user?.id;

  return (
    <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
      <WelcomeModal
        greetingName={greetingName}
        userId={activeUserId}
        isLongTimeAway={user?.isLongTimeAway}
      />

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

      <SuggestedSpacesSection
        exploreClassrooms={exploreClassrooms}
        classrooms={classrooms}
      />
    </div>
  );
}
