import { useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  MoreVertical,
  Trash2,
  Send,
  Loader2,
  Pin,
  AlertCircle,
  Megaphone,
  Bookmark,
  FileText,
} from "lucide-react";
import { routes } from "@/routes/paths.js";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ReactionPicker } from "./ReactionPicker.jsx";
import { ReactionSummary } from "./ReactionSummary.jsx";
import { PollPostWidget } from "./PollPostWidget.jsx";
import { PostMediaCarousel } from "./PostMediaCarousel.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
} from "../api/commentApi.js";
import { useDeleteCourseworkMutation } from "../api/courseworkApi.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { formatRelativeDate } from "@/utils/dateFormat.js";
import { cn } from "@/lib/utils.js";

const TYPE_CONFIG = {
  ANNOUNCEMENT: { label: "Announcement", icon: Megaphone, badgeVariant: "secondary" },
  DISCUSSION: { label: "Discussion", icon: MessageSquare, badgeVariant: "secondary" },
  ASSIGNMENT: { label: "Assignment", icon: FileText, badgeVariant: "default" },
  MATERIAL: { label: "Resource", icon: Bookmark, badgeVariant: "outline" },
};

export function SpaceFeedPost({
  post,
  pinned = false,
  courseId,
  canManage = false,
  onDelete,
}) {
  const { user } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [commentError, setCommentError] = useState("");

  // Interactive Reactions & Polls
  const [userReaction, setUserReaction] = useState(post.userReaction || null);
  const [reactions, setReactions] = useState(
    post.reactions || (post.likes ? { LOVE: post.likes } : {})
  );
  const [poll, setPoll] = useState(post.poll || null);

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

  const [deleteCoursework, { isLoading: isDeletingPost }] =
    useDeleteCourseworkMutation();

  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.name ||
        post.creatorName ||
        post.teacherName ||
        "Space Member";

  const authorAvatar =
    (typeof post.author === "object" ? post.author?.avatarUrl || post.author?.avatar : null) ||
    post.creatorAvatar ||
    post.teacherAvatar ||
    null;

  const authorId =
    (typeof post.author === "object" ? post.author?.id : null) ||
    post.authorId ||
    post.creatorId ||
    post.teacherId ||
    null;

  const content = post.description || post.content || post.title || "";

  // Relative timestamp with fallback
  const relativeTime = post.createdAt ? formatRelativeDate(post.createdAt) : null;
  const fullDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : post.time || "";
  const displayTime = relativeTime || fullDate;

  // Post Type styling
  const typeConfig = TYPE_CONFIG[post.type] || TYPE_CONFIG.ANNOUNCEMENT;
  const TypeIcon = typeConfig.icon;

  const { data: comments = [], isLoading: isLoadingComments } =
    useGetCourseworkCommentsQuery(
      { courseworkId: post.id },
      { skip: !commentsOpen || !post?.id }
    );

  const [addComment, { isLoading: isSubmittingComment }] =
    useAddCourseworkCommentMutation();

  const isAuthor = Boolean(
    user?.id &&
      (String(authorId) === String(user.id) ||
        String(post.authorId) === String(user.id) ||
        String(post.creatorId) === String(user.id))
  );

  const canDelete = Boolean(canManage || isAuthor);

  const handleDelete = async () => {
    if (!post?.id || isDeletingPost) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      if (onDelete) {
        await onDelete(post.id);
      } else if (courseId) {
        await deleteCoursework({
          courseId,
          courseworkId: post.id,
        }).unwrap();
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const submitReply = async (event) => {
    event.preventDefault();
    if (!reply.trim() || !post?.id || isSubmittingComment) return;
    setCommentError("");
    try {
      await addComment({
        courseworkId: post.id,
        payload: { body: reply.trim(), content: reply.trim() },
      }).unwrap();
      setReply("");
    } catch (err) {
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to post comment. Please try again.";
      setCommentError(errMsg);
    }
  };

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-2xs transition-all",
        pinned && "ring-1 ring-primary/30 border-primary/20 bg-primary/2"
      )}
    >
      {pinned && (
        <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Pin className="h-3.5 w-3.5 fill-primary/20" />
          <span>Pinned Announcement</span>
        </div>
      )}

      <div className="flex gap-3">
        <ClassroomAvatar
          name={authorName}
          avatar={authorAvatar}
          userId={authorId}
          size="h-9 w-9 sm:h-10 sm:w-10"
        />

        <div className="min-w-0 flex-1">
          {/* Post Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {authorId ? (
                  <Link
                    to={routes.user(authorId)}
                    className="text-xs sm:text-sm font-semibold text-text-heading hover:text-primary hover:underline transition-colors truncate"
                  >
                    {authorName}
                  </Link>
                ) : (
                  <span className="text-xs sm:text-sm font-semibold text-text-heading truncate">
                    {authorName}
                  </span>
                )}

                {displayTime && (
                  <span
                    className="text-[11px] text-text-muted cursor-help shrink-0"
                    title={fullDate}
                  >
                    • {displayTime}
                  </span>
                )}
              </div>

              {post.type && (
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge
                    variant={typeConfig.badgeVariant}
                    className="gap-1 py-0 px-2 text-[10px] font-medium h-4.5"
                  >
                    <TypeIcon className="h-2.5 w-2.5" />
                    <span>{typeConfig.label}</span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Post Options Dropdown */}
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-lg p-1 text-text-muted hover:bg-canvas hover:text-text-main transition focus:outline-hidden cursor-pointer"
                  aria-label="Post actions"
                  disabled={isDeletingPost}
                >
                  {isDeletingPost ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete post</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Title */}
          {post.title &&
            post.title !== "Announcement" &&
            post.title !== "Space Update" && (
              <h4 className="mt-2 text-sm sm:text-base font-bold text-text-heading">
                {post.title}
              </h4>
            )}

          {/* Body Content */}
          <p className="mt-1.5 text-xs sm:text-sm text-text-main whitespace-pre-wrap leading-relaxed">
            {content}
          </p>

          {/* Interactive Poll */}
          {poll && (
            <PollPostWidget
              poll={poll}
              onVote={handleVotePoll}
            />
          )}

          {/* Media Carousel / Gallery */}
          {post.media && post.media.length > 0 && (
            <PostMediaCarousel media={post.media} />
          )}

          {/* Footer Controls: Reactions & Comments */}
          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
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
                "inline-flex items-center gap-1.5 font-medium transition cursor-pointer hover:text-primary text-xs text-text-muted",
                commentsOpen && "text-primary font-semibold"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{commentsOpen ? "Hide comments" : "Discussion"}</span>
              {comments.length > 0 && (
                <span className="rounded-full bg-canvas px-1.5 py-0.2 text-[10px] font-semibold text-text-main border border-border">
                  {comments.length}
                </span>
              )}
            </button>
          </div>

          {/* Comments Section */}
          {commentsOpen && (
            <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
              <div className="space-y-2.5">
                {isLoadingComments ? (
                  <div className="flex items-center justify-center gap-2 py-3 text-xs text-text-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>Loading comments…</span>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => {
                    const commentAuthor =
                      comment.author?.name ||
                      comment.authorName ||
                      "Space Member";
                    const commenterId =
                      comment.author?.id ||
                      comment.authorId ||
                      comment.userId ||
                      null;
                    const commenterAvatar =
                      comment.author?.avatarUrl ||
                      comment.author?.avatar ||
                      comment.avatarUrl ||
                      null;
                    const commentTime = comment.createdAt
                      ? formatRelativeDate(comment.createdAt)
                      : null;

                    return (
                      <div key={comment.id} className="flex items-start gap-2.5 text-sm">
                        <ClassroomAvatar
                          name={commentAuthor}
                          avatar={commenterAvatar}
                          userId={commenterId}
                          size="h-7 w-7"
                        />
                        <div className="flex-1 rounded-xl bg-canvas/70 border border-border/60 px-3 py-2 text-text-main">
                          <div className="flex items-center justify-between gap-2">
                            {commenterId ? (
                              <Link
                                to={routes.user(commenterId)}
                                className="font-semibold text-text-heading text-xs hover:text-primary hover:underline transition-colors"
                              >
                                {commentAuthor}
                              </Link>
                            ) : (
                              <span className="font-semibold text-text-heading text-xs">
                                {commentAuthor}
                              </span>
                            )}
                            {commentTime && (
                              <span className="text-[10px] text-text-muted">
                                {commentTime}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs sm:text-sm whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-2 text-center text-xs text-text-muted">
                    No comments yet. Start the discussion below!
                  </p>
                )}
              </div>

              {/* Comment Error */}
              {commentError && (
                <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{commentError}</span>
                </div>
              )}

              {/* Add Comment Input */}
              <form onSubmit={submitReply} className="flex items-center gap-2 pt-1">
                <ClassroomAvatar
                  name={user?.name || user?.username || "You"}
                  avatar={user?.avatarUrl || user?.avatar}
                  userId={user?.id || ""}
                  size="h-7 w-7 shrink-0 hidden sm:inline-flex"
                />
                <Input
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    if (commentError) setCommentError("");
                  }}
                  disabled={isSubmittingComment}
                  placeholder="Write a comment or question…"
                  className="h-8.5 text-xs sm:text-sm bg-canvas/50"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!reply.trim() || isSubmittingComment}
                  className="h-8.5 px-3 gap-1.5 text-xs font-medium cursor-pointer"
                >
                  {isSubmittingComment ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline">Reply</span>
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export const ClassFeedPost = SpaceFeedPost;
export default SpaceFeedPost;

