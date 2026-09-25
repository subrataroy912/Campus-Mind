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
import { useSearchParams } from "react-router";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
import { useCommunityFeed } from "../hooks/useCommunityFeed.js";
import { SpaceAvatar } from "@/features/spaces/components/SpaceAvatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";

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
  const meta = TYPE_META[post.type] || TYPE_META.discussion;
  const Icon = meta.icon;

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };

  return (
    <article className="rounded-lg border border-border/80 bg-surface p-3 sm:p-3.5 shadow-xs transition-colors hover:border-border">
      {post.pinned && (
        <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-secondary">
          <Pin size={12} aria-hidden="true" />
          <span>Pinned in {post.classroom}</span>
        </div>
      )}
      <div className="flex gap-2.5">
        <SpaceAvatar
          to="#"
          avatar={post?.author?.avatar}
          name={post?.author?.name}
          size="h-7 w-7"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="text-xs font-semibold text-text-heading">
              {post?.author?.name}
            </span>
            <span className="text-[11px] text-text-muted">
              · {post.classroom}
            </span>
            <span className="text-[11px] text-text-muted">· {post.time}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-text-main">
            {post.content}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border border-border/60 ${meta.className}`}
            >
              <Icon size={11} aria-hidden="true" />
              {meta.label}
            </span>
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 text-[11px] font-medium transition hover:text-primary ${liked ? "text-primary" : "text-text-muted"}`}
            >
              <Heart
                size={12}
                aria-hidden="true"
                className={liked ? "fill-current" : ""}
              />{" "}
              {likeCount}
            </button>
            <button className="flex items-center gap-1 text-[11px] font-medium text-text-muted transition hover:text-primary">
              <MessageCircle size={12} aria-hidden="true" /> {post.comments}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const communityFilter = searchParams.get("filter") || "all";
  const [draft, setDraft] = useState("");
  const { classrooms = [] } = useDashboardData({ includeExplore: false });
  const { data, isLoading, error } = useCommunityFeed();

  const [localPosts, setLocalPosts] = useState(null);

  const posts = localPosts ?? data?.posts ?? EMPTY_FEED;
  const filters = data?.filters ?? EMPTY_FEED;

  const filteredPosts = useMemo(() => {
    if (communityFilter === "all") return posts;
    return posts.filter((post) => post.type === communityFilter);
  }, [communityFilter, posts]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const newPost = {
      id: `post-${Date.now()}`,
      type: "discussion",
      pinned: false,
      classroom: classrooms[0]?.title || "General Campus Community",
      time: "Just now",
      author: {
        name: user?.name || "You",
        avatar: user?.avatar,
      },
      content: text,
      likes: 0,
      comments: 0,
    };

    setLocalPosts([newPost, ...posts]);
    setDraft("");
  };

  if (isLoading) {
    return (
      <div className="grid min-h-64 place-items-center text-xs text-text-muted">
        Loading community…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6">
        <EmptyState
          title="We could not load the community"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-8 min-w-0">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-text-heading">
            Campus Community
          </h1>
          <p className="text-xs text-text-muted">
            Discussions, questions, and announcements across your enrolled
            spaces and university peers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-xs font-medium text-text-heading shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{filteredPosts.length} discussions</span>
          </span>
        </div>
      </header>

      {/* Responsive Two-Column Layout to Eliminate Awkward Horizontal Padding */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] items-start">
        {/* Main Feed Column */}
        <div className="min-w-0 space-y-3">
          {/* Post Composer Card */}
          <form
            onSubmit={handleCreatePost}
            className="rounded-lg border border-border/80 bg-surface p-3 shadow-xs"
          >
            <div className="flex gap-2.5">
              <SpaceAvatar
                to={routes.profile.root}
                avatar={user?.avatar}
                name={user?.name}
                size="h-7 w-7"
              />
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={2}
                  placeholder="Ask a question or share something with your classes…"
                  className="w-full resize-none rounded-md border border-border/70 bg-canvas px-2.5 py-1.5 text-base sm:text-xs text-text-heading outline-none placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-focus"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    type="submit"
                    disabled={!draft.trim()}
                    className="min-h-9 sm:h-7 px-3 text-xs gap-1.5 cursor-pointer"
                  >
                    <Send size={12} aria-hidden="true" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Filter Bar */}
          <div
            className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-border/60 bg-surface/50 p-1"
            role="tablist"
            aria-label="Filter community feed"
          >
            {filters.map((filter) => {
              const active = communityFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      if (filter.id === "all") {
                        next.delete("filter");
                      } else {
                        next.set("filter", filter.id);
                      }
                      return next;
                    });
                  }}
                  role="tab"
                  aria-selected={active}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                      : "text-text-muted hover:text-text-main hover:bg-canvas/60"
                  }`}
                >
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feed Post List */}
          <div className="space-y-2.5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <CommunityPost key={post.id} post={post} />
              ))
            ) : (
              <EmptyState
                title="Nothing in this filter yet"
                description="Try a different filter, or post the first update to your class."
              />
            )}
          </div>
        </div>

        {/* High-Density Right Sidebar */}
        <aside className="hidden lg:block space-y-3 shrink-0">
          {/* Community Guidelines Card */}
          <div className="rounded-lg border border-border/80 bg-surface p-3.5 shadow-xs">
            <h2 className="text-xs font-semibold text-text-heading">
              About Campus Community
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
              Connect with classmates, join study group discussions, and share
              insights across your enrolled classes.
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px]">
              <span className="text-text-muted">Campus Honor Code</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            </div>
          </div>

          {/* Trending Topics Card */}
          <div className="rounded-lg border border-border/80 bg-surface p-3.5 shadow-xs">
            <h2 className="text-xs font-semibold text-text-heading">
              Trending Topics
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                "#algorithms",
                "#midterms",
                "#hackathon2026",
                "#distributed-systems",
                "#ui-ux",
                "#quantum",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-border/60 bg-canvas/60 px-2 py-0.5 text-[10px] font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Active Spaces Directory */}
          <div className="rounded-lg border border-border/80 bg-surface p-3.5 shadow-xs">
            <h2 className="text-xs font-semibold text-text-heading">
              Active Spaces
            </h2>
            <div className="mt-2 space-y-2 text-xs">
              {[
                { name: "Algorithms & Data Structures", count: "25 members" },
                { name: "Distributed Systems", count: "18 members" },
                { name: "UI/UX & Product Design", count: "32 members" },
                { name: "Quantum Computing Lab", count: "14 members" },
                { name: "Campus Hackathon 2026", count: "45 members" },
              ].map((sp) => (
                <div
                  key={sp.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate text-[11px] font-medium text-text-heading hover:text-primary cursor-pointer">
                    {sp.name}
                  </span>
                  <span className="shrink-0 text-[10px] text-text-muted">
                    {sp.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
