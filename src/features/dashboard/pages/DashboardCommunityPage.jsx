import { useMemo, useState } from "react";
import {
  Heart,
  Megaphone,
  MessageCircle,
  MessageCircleQuestion,
  MessagesSquare,
  BarChart2,
  Pin,
  Send,
} from "lucide-react";
import { useSearchParams } from "react-router";

import { useCommunityFeed } from "../hooks/useCommunityFeed.js";
import { FeedTabsNav } from "../components/FeedTabsNav.jsx";
import { SpacePostBox } from "@/features/classroom/components/SpacePostBox.jsx";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { ReactionPicker } from "@/features/classroom/components/ReactionPicker.jsx";
import { ReactionSummary } from "@/features/classroom/components/ReactionSummary.jsx";
import { PollPostWidget } from "@/features/classroom/components/PollPostWidget.jsx";
import { PostMediaCarousel } from "@/features/classroom/components/PostMediaCarousel.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { cn } from "@/lib/utils.js";

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
  poll: {
    label: "Live Poll",
    icon: BarChart2,
    className: "bg-canvas text-amber-500",
  },
};

const INITIAL_CAMPUS_FEED = [
  {
    id: "campus-pulse-1",
    author: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    classroom: "CS Capstone & Senior Design",
    type: "poll",
    time: "25m ago",
    pinned: true,
    content: "Quick poll for everyone preparing their final capstone projects! Which frontend stack or mobile tech is your group locking in this semester?",
    poll: {
      id: "poll-capstone-1",
      question: "Which stack is your group using for Capstone?",
      options: [
        { id: "opt-1", text: "React + Vite (Modern SPA)", votes: 46 },
        { id: "opt-2", text: "Next.js / Full-stack Framework", votes: 32 },
        { id: "opt-3", text: "Mobile (React Native / Flutter)", votes: 19 },
        { id: "opt-4", text: "AI / Python (FastAPI + Streamlit)", votes: 27 },
      ],
      totalVotes: 124,
      duration: "3 Days",
      status: "Active poll · 124 votes",
    },
    reactions: { LOVE: 18, FIRE: 35, BRILLIANT: 12, SPOT_ON: 21 },
    commentsCount: 16,
    commentsList: [
      {
        id: "c1",
        authorName: "Maya Lin",
        text: "We chose React + Vite with Tailwind and RTK Query — build speeds are blazing fast!",
        time: "15m ago",
      },
      {
        id: "c2",
        authorName: "Devon Chen",
        text: "Same here. Vite HMR is unmatched when collaborating across team branches.",
        time: "8m ago",
      },
    ],
  },
  {
    id: "campus-pulse-2",
    author: {
      name: "Campus Tech Society",
      avatar: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=150&auto=format&fit=crop&q=80",
    },
    classroom: "Campus Announcements",
    type: "announcement",
    time: "2h ago",
    content: "🚀 Annual Campus Hackathon 2026 is officially announced! $5,000 in total prizes, industry mentors from top tech firms, and 36 hours to build impactful campus solutions. Check out the venues and teaser below!",
    media: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    ],
    reactions: { FIRE: 64, RESPECT: 31, LOVE: 22 },
    commentsCount: 29,
  },
  {
    id: "campus-pulse-3",
    author: {
      name: "Professor Hastings",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    classroom: "Algorithms & Data Structures",
    type: "discussion",
    time: "4h ago",
    content: "Midterm Review Study Table: We will host a collaborative peer problem-solving session this Thursday at 5 PM in Room 302. Bring your hardest dynamic programming recurrence relations to dissect together.",
    reactions: { BRILLIANT: 45, RESPECT: 18, SPOT_ON: 12 },
    commentsCount: 14,
  },
];

function InteractiveCommunityPost({ post }) {
  const meta = TYPE_META[post.type] || TYPE_META.discussion;
  const Icon = meta.icon;

  const [userReaction, setUserReaction] = useState(post.userReaction || null);
  const [reactions, setReactions] = useState(
    post.reactions || (post.likes ? { LOVE: post.likes } : {})
  );
  const [poll, setPoll] = useState(post.poll || null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState(post.commentsList || []);
  const [newComment, setNewComment] = useState("");

  const handleSelectReaction = (reactionId) => {
    const prevReaction = userReaction;
    setUserReaction(reactionId);
    setReactions((prev) => {
      const next = { ...prev };
      if (prevReaction && next[prevReaction] > 0) {
        next[prevReaction] = next[prevReaction] - 1;
      }
      if (reactionId) {
        next[reactionId] = (next[reactionId] || 0) + 1;
      }
      return next;
    });
  };

  const handleVotePoll = (optionId) => {
    if (!poll) return;
    setPoll((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        userVotedOptionId: optionId,
        totalVotes: (prev.totalVotes || 0) + 1,
        options: prev.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
        ),
      };
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: `c-${Date.now()}`,
      authorName: "You",
      text: newComment.trim(),
      time: "Just now",
    };
    setComments((prev) => [...prev, commentObj]);
    setNewComment("");
  };

  const totalCommentCount = (post.commentsCount || post.comments || 0) + (comments.length - (post.commentsList?.length || 0));

  return (
    <article className="rounded-2xl bg-surface p-4 sm:p-5 shadow-2xs border border-border transition-all hover:border-border/90">
      {post.pinned && (
        <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Pin size={13} className="fill-primary/20" aria-hidden="true" />
          <span>Pinned Announcement</span>
        </div>
      )}

      <div className="flex gap-3">
        <ClassroomAvatar
          to="#"
          avatar={post?.author?.avatar}
          name={post?.author?.name}
          size="h-9 w-9 sm:h-10 sm:w-10"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-xs sm:text-sm font-semibold text-text-heading truncate">
              {post?.author?.name}
            </span>
            {post.classroom && (
              <span className="text-[11px] text-text-muted">· {post.classroom}</span>
            )}
            {post.time && (
              <span className="text-[11px] text-text-muted">· {post.time}</span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
            >
              <Icon size={11} aria-hidden="true" />
              {meta.label}
            </span>
          </div>

          {post.title && (
            <h3 className="mt-2 text-sm sm:text-base font-bold text-text-heading">
              {post.title}
            </h3>
          )}

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-main whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Interactive Poll */}
          {poll && (
            <PollPostWidget poll={poll} onVote={handleVotePoll} />
          )}

          {/* Media Carousel */}
          {post.media && post.media.length > 0 && (
            <PostMediaCarousel media={post.media} />
          )}

          {/* Micro-Interaction Footer */}
          <div className="mt-3.5 flex items-center justify-between border-t border-border/40 pt-2.5">
            <div className="flex items-center gap-2">
              <ReactionPicker
                userReaction={userReaction}
                onSelectReaction={handleSelectReaction}
              />
              <ReactionSummary reactions={reactions} />
            </div>

            <button
              type="button"
              onClick={() => setCommentsOpen((open) => !open)}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs text-text-muted transition hover:text-primary cursor-pointer",
                commentsOpen && "text-primary font-semibold"
              )}
            >
              <MessageCircle size={14} aria-hidden="true" />
              <span>{commentsOpen ? "Hide" : "Comments"}</span>
              {totalCommentCount > 0 && (
                <span className="rounded-full bg-canvas px-1.5 py-0.2 text-[10px] font-semibold text-text-main border border-border">
                  {totalCommentCount}
                </span>
              )}
            </button>
          </div>

          {/* Comments Tray */}
          {commentsOpen && (
            <div className="mt-3 space-y-2.5 border-t border-border/50 pt-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl bg-canvas/50 p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-text-heading">
                    <span>{comment.authorName}</span>
                    <span className="text-[10px] text-text-muted font-normal">
                      {comment.time}
                    </span>
                  </div>
                  <p className="mt-1 text-text-main leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a reply…"
                  className="flex-1 rounded-xl border border-border bg-canvas px-3 py-1.5 text-xs text-text-heading outline-none focus:border-primary"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim()}
                  className="h-8 text-xs font-medium px-2.5"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function DashboardCommunityPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active discovery tab: "for-you", "spaces", "trending"
  const activeTab = searchParams.get("tab") || "for-you";
  // Active content filter: "all", "question", "discussion", "poll", "announcement"
  const activeFilter = searchParams.get("filter") || "all";

  const { data, isLoading, error } = useCommunityFeed();

  // Local state for user-created posts in this session
  const [customPosts, setCustomPosts] = useState([]);

  // Merge backend data with rich campus pulse posts
  const allPosts = useMemo(() => {
    const backendPosts = data?.posts || [];
    return [...customPosts, ...backendPosts, ...INITIAL_CAMPUS_FEED];
  }, [customPosts, data?.posts]);

  // Tab Filtering & Sorting
  const tabFilteredPosts = useMemo(() => {
    let list = [...allPosts];

    if (activeTab === "spaces") {
      // Show updates from joined spaces
      list = list.filter(
        (p) => p.classroom && p.classroom !== "Campus Announcements"
      );
    } else if (activeTab === "trending") {
      // Sort by engagement velocity (reactions + poll votes + comments)
      list = list.sort((a, b) => {
        const scoreA =
          (a.poll?.totalVotes || 0) +
          Object.values(a.reactions || {}).reduce((s, v) => s + v, 0) +
          (a.commentsCount || a.comments || 0);
        const scoreB =
          (b.poll?.totalVotes || 0) +
          Object.values(b.reactions || {}).reduce((s, v) => s + v, 0) +
          (b.commentsCount || b.comments || 0);
        return scoreB - scoreA;
      });
    }

    // Apply content type filter
    if (activeFilter !== "all") {
      list = list.filter((post) => post.type === activeFilter);
    }

    return list;
  }, [allPosts, activeTab, activeFilter]);

  const handleTabChange = (newTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", newTab);
      return next;
    });
  };

  const handleFilterChange = (newFilter) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newFilter === "all") {
        next.delete("filter");
      } else {
        next.set("filter", newFilter);
      }
      return next;
    });
  };

  const handleCreatePost = (payload) => {
    const newPost = {
      id: `custom-post-${Date.now()}`,
      author: {
        name: user?.name || user?.username || "You",
        avatar: user?.avatarUrl || user?.avatar,
      },
      classroom: "Campus Community",
      type: payload.poll
        ? "poll"
        : payload.type === "ANNOUNCEMENT"
          ? "announcement"
          : payload.type === "DISCUSSION"
            ? "discussion"
            : "question",
      time: "Just now",
      title: payload.title,
      content: payload.content || payload.text,
      poll: payload.poll || null,
      media: payload.media ? payload.media.map((m) => m.url) : null,
      reactions: { LOVE: 1 },
      userReaction: "LOVE",
      commentsCount: 0,
    };

    setCustomPosts((prev) => [newPost, ...prev]);
  };

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
    <div className="mx-auto max-w-3xl p-3 sm:p-6 space-y-5">
      {/* Header */}
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Campus Pulse
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-text-heading">
          Student Feed & Community
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-text-muted">
          Real-time polls, peer discussions, class announcements, and trending campus buzz.
        </p>
      </header>

      {/* Discovery Multi-Tabs Navigation */}
      <FeedTabsNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Interactive Rich Post Box */}
      <SpacePostBox
        onSubmit={handleCreatePost}
        placeholder="Ask a campus question, create a live poll, or share an insight…"
      />

      {/* Posts Stream */}
      <div className="space-y-4 pt-1">
        {tabFilteredPosts.length > 0 ? (
          tabFilteredPosts.map((post) => (
            <InteractiveCommunityPost key={post.id} post={post} />
          ))
        ) : (
          <EmptyState
            title="No posts in this filter yet"
            description="Be the first to share an update, start a poll, or join a conversation."
          />
        )}
      </div>
    </div>
  );
}
