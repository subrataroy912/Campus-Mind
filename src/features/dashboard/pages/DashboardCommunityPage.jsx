import { useMemo, useState } from "react";
import {
  Heart,
  Megaphone,
  MessageCircle,
  MessageCircleQuestion,
  MessagesSquare,
  Pin,
  Send,
} from "lucide-react";

import { useDashboardData } from "../useDashboardData.js";
import { useCommunityFeed } from "../hooks/useCommunityFeed.js";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const TYPE_META = {
  announcement: {
    label: "Announcement",
    icon: Megaphone,
    className: "bg-canvas text-secondary",
  },
  question: {
    label: "Question",
    icon: MessageCircleQuestion,
    className: "bg-canvas text-accent",
  },
  discussion: {
    label: "Discussion",
    icon: MessagesSquare,
    className: "bg-canvas text-primary",
  },
};
const EMPTY_FEED = [];

function CommunityPost({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const meta = TYPE_META[post.type];
  const Icon = meta.icon;

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };

  return (
    <article className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-5">
      {post.pinned && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-secondary">
          <Pin size={14} aria-hidden="true" />
          Pinned in {post.classroom}
        </div>
      )}
      <div className="flex gap-3">
        <ClassroomAvatar
          to="#"
          avatar={post?.author?.avatar}
          name={post?.author?.name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-text-heading">
              {post?.author?.name}
            </span>
            <span className="text-xs text-text-muted">· {post.classroom}</span>
            <span className="text-xs text-text-muted">· {post.time}</span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-text-main">
            {post.content}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
            >
              <Icon size={12} aria-hidden="true" />
              {meta.label}
            </span>
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 text-xs transition hover:text-primary ${liked ? "text-primary" : "text-text-muted"}`}
            >
              <Heart size={14} aria-hidden="true" /> {likeCount}
            </button>
            <button className="flex items-center gap-1.5 text-xs text-text-muted transition hover:text-primary">
              <MessageCircle size={14} aria-hidden="true" /> {post.comments}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DashboardCommunityPage() {
  const { user } = useAuth();
  const { classrooms = [] } = useDashboardData();
  const { data, isLoading, error } = useCommunityFeed();
  const [activeFilter, setActiveFilter] = useState("all");
  const [draft, setDraft] = useState("");

  const posts = data?.posts ?? EMPTY_FEED;
  const filters = data?.filters ?? EMPTY_FEED;

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts;
    return posts.filter((post) => post.type === activeFilter);
  }, [activeFilter, posts]);

  const hasClasses = classrooms.length > 0;

  if (isLoading) {
    return (
      <div className="grid min-h-64 place-items-center text-sm text-text-muted">
        Loading community…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-3 sm:p-6">
        <EmptyState
          title="We could not load the community"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-6">
      <header>
        <p className="text-sm font-semibold text-primary">Community</p>
        {/* <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
          Learn better together.
        </h1> */}
        <p className="mt-2 text-text-muted">
          Announcements, questions, and discussions from every class you're part
          of.
        </p>
      </header>

      {!hasClasses ? (
        <div className="mt-8">
          <EmptyState
            title="No community updates yet"
            description="Start with a class to keep conversations focused and helpful."
            action={{ to: "/dashboard/class/join", label: "Join a class" }}
          />
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
            <div className="flex gap-3">
              <ClassroomAvatar to="/dashboard/profile" avatar={user?.avatar} name={user?.name} />
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={2}
                  placeholder="Ask a question or share something with your classes…"
                  className="w-full resize-none rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-text-heading outline-none placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-focus"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    disabled={!draft.trim()}
                    className="gap-1.5"
                  >
                    <Send size={14} aria-hidden="true" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="-mx-1 mt-6 flex max-w-full gap-1 overflow-x-auto px-1 pb-1"
            role="tablist"
            aria-label="Filter community feed"
          >
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                role="tab"
                aria-selected={activeFilter === filter.id}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <CommunityPost key={post.id} post={post} />
              ))
            ) : (
              <EmptyState
                title="Nothing in this filter yet"
                description="Try a different filter, or check back after your next class."
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
