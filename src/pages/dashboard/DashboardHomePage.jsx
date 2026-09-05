import { useEffect, useMemo, useState } from "react";
import { Compass } from "lucide-react";
import {
  fetchClassrooms,
  fetchExploreClassrooms,
} from "../../features/classroom/api/classroomService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Button } from "../../components/ui/button.jsx";
import ClassCard from "../../components/dashboard/ClassCard.jsx";
import ExploreClassCard from "../../components/dashboard/ExploreClassCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [exploreClassrooms, setExploreClassrooms] = useState([]);
  const [status, setStatus] = useState("loading");
  const [feedFilter, setFeedFilter] = useState("all");

  useEffect(() => {
    let active = true;
    Promise.all([fetchClassrooms(), fetchExploreClassrooms()])
      .then(([joined, explore]) => {
        if (active) {
          setClassrooms(joined);
          setExploreClassrooms(explore);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const feedClasses = useMemo(() => {
    const joinedCodes = new Set(classrooms.map((classroom) => classroom.code));
    const available = exploreClassrooms.filter(
      (classroom) => !joinedCodes.has(classroom.code),
    );
    if (feedFilter === "popular")
      return [...available].sort((a, b) => b.popularity - a.popularity);
    if (feedFilter === "recommended")
      return available.filter((classroom) => classroom.recommended);
    return available;
  }, [classrooms, exploreClassrooms, feedFilter]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <header>
        <p className="text-sm font-semibold text-primary">
          Your learning space
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
          Welcome back, {user?.name?.split(" ")[0] || "there"}.
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
            {status === "ready"
              ? `${classrooms.length} classes`
              : "Loading classes…"}
          </span>
        </div>
        {status === "ready" && classrooms.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {classrooms.map((classroom) => (
              <ClassCard classroom={classroom} key={classroom.id} />
            ))}
          </div>
        )}
        {status === "ready" && !classrooms.length && (
          <EmptyState
            title="Your class list is ready for you"
            description="Create a class for your group or join one with a code."
            action={{ to: "/dashboard/class/join", label: "Join a class" }}
          />
        )}
        {status === "error" && (
          <EmptyState
            title="We could not load your classes"
            description="Please refresh the page and try again."
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
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Explore classes"
          >
            <Button
              variant={feedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedFilter("all")}
              role="tab"
              aria-selected={feedFilter === "all"}
            >
              Explore all
            </Button>
            <Button
              variant={feedFilter === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedFilter("popular")}
              role="tab"
              aria-selected={feedFilter === "popular"}
            >
              Popular
            </Button>
            <Button
              variant={feedFilter === "recommended" ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedFilter("recommended")}
              role="tab"
              aria-selected={feedFilter === "recommended"}
            >
              Recommended
            </Button>
          </div>
        </div>
        {status === "ready" && feedClasses.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {feedClasses.map((classroom) => (
              <ExploreClassCard classroom={classroom} key={classroom.id} />
            ))}
          </div>
        )}
        {status === "ready" && !feedClasses.length && (
          <EmptyState
            title="You are all caught up"
            description="There are no more classes to show in this part of the feed."
          />
        )}
      </section>
    </div>
  );
}
