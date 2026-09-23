import { useState, memo } from "react";
import { Link } from "react-router";
import { routes } from "@/routes/paths.js";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";
import {
  commentApi,
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
} from "../api/commentApi.js";
import { store } from "@/app/store.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import { Card } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.jsx";
import {
  MoreVertical,
  Pin,
  Trash2,
  Edit3,
  ExternalLink,
  FileText,
  Video as VideoIcon,
  Globe,
  ClipboardList,
  BookOpen,
  Calendar,
} from "lucide-react";

function formatPostDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function ClassFeedPost({
  post,
  pinned = false,
  isStaff = false,
  currentUser = null,
  onEdit,
  onDelete,
  onPin,
}) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editDescription, setEditDescription] = useState(
    post.description || post.content || post.title || "",
  );
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const isPinned = Boolean(post.pinned ?? pinned);

  const authorName =
    post.creatorName ||
    (typeof post.author === "string" ? post.author : post.author?.name) ||
    "Space Member";
  const authorAvatar =
    post.creatorAvatarUrl ||
    (typeof post.author === "object" ? post.author?.avatarUrl : null);

  const authorHandle =
    post.creatorHandle ||
    (typeof post.author === "object" ? post.author?.handle : null);

  const authorId =
    post.creatorId ||
    (typeof post.author === "object" ? post.author?.id : null) ||
    post.authorId ||
    null;

  const currentUserId = currentUser?.id;
  const isAuthor =
    Boolean(currentUserId) &&
    (currentUserId === authorId || currentUserId === post.creatorId);
  const canManage = isAuthor || isStaff;

  const content = post.description || post.content || post.title || "";
  const displayTime =
    formatPostDate(post.publishedAt || post.createdAt) || post.time || "";

  const isAssignment = post.type === "ASSIGNMENT";
  const isMaterial = post.type === "MATERIAL";
  const attachments = Array.isArray(post.attachments) ? post.attachments : [];

  const courseworkId = post?.id || post?._id || post?.courseworkId;

  // Eagerly fetch comments for pinned posts; on-demand/prefetched for regular posts
  const shouldFetchComments = commentsOpen || isPinned;

  const { data: comments = [], isLoading: isLoadingComments } =
    useGetCourseworkCommentsQuery(
      { courseworkId },
      { skip: !shouldFetchComments || !courseworkId },
    );

  const handlePrefetchComments = () => {
    if (courseworkId) {
      store.dispatch(
        commentApi.util.prefetch(
          "getCourseworkComments",
          { courseworkId },
          { ifOlderThan: 60 },
        ),
      );
    }
  };

  const commentCount =
    comments.length > 0
      ? comments.length
      : (post.commentCount ?? post.commentsCount ?? 0);

  const [addComment, { isLoading: isSubmittingComment }] =
    useAddCourseworkCommentMutation();

  const handleSaveEdit = async () => {
    if (!editDescription.trim()) return;
    setIsSavingEdit(true);
    try {
      const changes = {
        description: editDescription.trim(),
      };
      if (post.title && post.title !== "Announcement") {
        changes.title = editTitle.trim() || post.title;
      }
      await onEdit?.(post.id, changes);
      setIsEditing(false);
    } catch {
      // Handled by parent or toast
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete?.(post.id);
    }
  };

  const handleTogglePin = () => {
    onPin?.(post.id, !isPinned);
  };

  const submitReply = async (event) => {
    event.preventDefault();
    if (!reply.trim() || !courseworkId) return;
    try {
      await addComment({
        courseworkId,
        payload: { body: reply.trim() },
      }).unwrap();
      setReply("");
    } catch (err) {
      toast.add({
        title: "Failed to post comment",
        description: parseApiError(
          err,
          "Unable to post your comment right now.",
        ).message,
        type: "error",
      });
    }
  };

  return (
    <Card className="relative rounded-xl border border-border/70 bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-border/90">
      {/* Pinned Badge */}
      {isPinned && (
        <div className="mb-2 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="h-5 gap-1 rounded-md border border-primary/20 bg-primary/10 px-1.5 text-[11px] font-medium text-primary"
          >
            <Pin className="h-3 w-3 fill-primary" />
            <span>Pinned announcement</span>
          </Badge>
        </div>
      )}

      {/* Assignment / Material Activity Header */}
      {(isAssignment || isMaterial) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-border/50 bg-muted/40 px-2.5 py-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {isAssignment ? (
              <Badge
                variant="outline"
                className="h-5 gap-1 rounded border-blue-500/30 bg-blue-500/10 px-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400"
              >
                <ClipboardList className="h-3 w-3" /> Assignment
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-5 gap-1 rounded border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <BookOpen className="h-3 w-3" /> Material
              </Badge>
            )}
            {post.maximumPoints != null && (
              <span className="text-[11px] font-medium text-muted-foreground">
                {post.maximumPoints} pts
              </span>
            )}
            {post.dueAt && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Due {new Date(post.dueAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <Link
            to="?tab=classwork"
            className="text-[11px] font-medium text-primary hover:underline"
          >
            View in Classwork &rarr;
          </Link>
        </div>
      )}

      <div className="flex gap-2.5">
        <ClassroomAvatar
          name={authorName}
          avatar={authorAvatar}
          userId={authorId}
          size="h-7 w-7 sm:h-8 sm:w-8"
        />

        <div className="min-w-0 flex-1">
          {/* Post Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2">
              {authorId ? (
                <Link
                  to={routes.user(authorId)}
                  className="text-xs font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                >
                  {authorName}
                </Link>
              ) : (
                <span className="text-xs font-semibold text-foreground">
                  {authorName}
                </span>
              )}

              {authorHandle && (
                <span className="text-[11px] text-muted-foreground">
                  {`@${authorHandle}`}
                </span>
              )}

              {displayTime && (
                <span className="text-[11px] text-muted-foreground">
                  • {displayTime}
                </span>
              )}
            </div>

            {/* Post Menu (3-dots) for Authors & Staff */}
            {(canManage || isStaff) && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="h-6 w-6 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer"
                      title="More actions"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title="More actions"
                />
                <DropdownMenuContent align="end" className="w-36 text-xs">
                  {isStaff && (
                    <DropdownMenuItem
                      onClick={handleTogglePin}
                      className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                    >
                      <Pin className="h-3.5 w-3.5 text-primary" />
                      <span>{isPinned ? "Unpin post" : "Pin post"}</span>
                    </DropdownMenuItem>
                  )}

                  {canManage && (
                    <>
                      <DropdownMenuItem
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleDelete}
                        className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Post Content or Edit Form */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              {post.title && post.title !== "Announcement" && (
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-8 text-xs font-semibold"
                  placeholder="Post title"
                />
              )}
              <Textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-18 text-xs resize-none"
                placeholder="Write your update…"
              />
              <div className="flex items-center justify-end gap-2 pt-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => setIsEditing(false)}
                  disabled={isSavingEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="xs"
                  onClick={handleSaveEdit}
                  loading={isSavingEdit}
                  disabled={!editDescription.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              {post.title && post.title !== "Announcement" && (
                <h4 className="mt-1 text-xs font-semibold text-foreground">
                  {post.title}
                </h4>
              )}
              {content && (
                <p className="mt-1 text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {content}
                </p>
              )}
            </>
          )}

          {/* Attachments Section */}
          {attachments.length > 0 && (
            <div className="mt-2.5 space-y-2">
              {/* Image Attachments */}
              {attachments.filter((a) => a.type === "IMAGE").length > 0 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {attachments
                    .filter((a) => a.type === "IMAGE")
                    .map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block aspect-video max-h-48 overflow-hidden rounded-lg border border-border/70 bg-muted/20"
                      >
                        <img
                          src={att.url}
                          alt={att.title || "Image attachment"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-102"
                          loading="lazy"
                        />
                        {att.title && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 text-[11px] font-medium text-white truncate">
                            {att.title}
                          </div>
                        )}
                      </a>
                    ))}
                </div>
              )}

              {/* Video Attachments (YouTube or direct) */}
              {attachments
                .filter((a) => a.type === "VIDEO")
                .map((att, idx) => {
                  const ytUrl = getYouTubeEmbedUrl(att.url);
                  return ytUrl ? (
                    <div
                      key={idx}
                      className="aspect-video max-h-64 overflow-hidden rounded-lg border border-border/70"
                    >
                      <iframe
                        src={ytUrl}
                        title={att.title || "Video"}
                        className="h-full w-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  ) : (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted/60"
                    >
                      <VideoIcon className="h-4 w-4 shrink-0 text-rose-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {att.title || "Video Link"}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {att.url}
                        </p>
                      </div>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </a>
                  );
                })}

              {/* File and Link Attachments */}
              {attachments.filter(
                (a) => a.type === "FILE" || a.type === "LINK",
              ).length > 0 && (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {attachments
                    .filter((a) => a.type === "FILE" || a.type === "LINK")
                    .map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-border hover:bg-muted/50"
                      >
                        {att.type === "FILE" ? (
                          <FileText className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        ) : (
                          <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium transition-colors group-hover:text-primary">
                            {att.title || att.url}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {att.url}
                          </p>
                        </div>
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground" />
                      </a>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Discussion / Comments Toggle */}
          <div className="mt-2.5 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setCommentsOpen((open) => !open)}
              onMouseEnter={handlePrefetchComments}
              onFocus={handlePrefetchComments}
              className="h-6 gap-1 px-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <ClassroomIcon name="comment" className="h-3.5 w-3.5" />
              <span>{commentsOpen ? "Hide discussion" : "Discussion"}</span>
              {commentCount > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 min-w-4 px-1 text-[10px] font-semibold"
                >
                  {commentCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Comments Thread */}
          {commentsOpen && (
            <div className="mt-2.5 border-t border-border/50 pt-2.5">
              <div className="space-y-2">
                {isLoadingComments ? (
                  <p className="text-[11px] text-muted-foreground">
                    Loading discussion…
                  </p>
                ) : comments.length ? (
                  comments.map((comment) => {
                    const commentAuthor =
                      comment.authorName ||
                      comment.author?.name ||
                      "Space Member";
                    const commentAvatar =
                      comment.authorAvatarUrl ||
                      comment.author?.avatarUrl ||
                      null;
                    const commenterId =
                      comment.authorId ||
                      comment.author?.id ||
                      comment.userId ||
                      null;
                    const commentText =
                      comment.content || comment.body || comment.message || "";
                    const commentTime = formatPostDate(comment.createdAt);

                    return (
                      <div key={comment.id} className="flex gap-2 text-xs">
                        <ClassroomAvatar
                          name={commentAuthor}
                          avatar={commentAvatar}
                          userId={commenterId}
                          size="h-6 w-6"
                        />
                        <div className="flex-1 rounded-lg bg-muted/40 px-2.5 py-1.5 text-foreground">
                          <div className="flex items-center justify-between gap-2">
                            {commenterId ? (
                              <Link
                                to={routes.user(commenterId)}
                                className="text-[11px] font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                              >
                                {commentAuthor}
                              </Link>
                            ) : (
                              <span className="text-[11px] font-semibold text-foreground">
                                {commentAuthor}
                              </span>
                            )}
                            {commentTime && (
                              <span className="text-[10px] text-muted-foreground">
                                {commentTime}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 whitespace-pre-wrap text-xs text-foreground/90">
                            {commentText}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    No comments yet. Start the discussion below.
                  </p>
                )}
              </div>

              {/* Reply Form */}
              <form
                onSubmit={submitReply}
                className="mt-2 flex items-center gap-2"
              >
                <ClassroomAvatar
                  name={
                    currentUser?.name ||
                    currentUser?.displayName ||
                    currentUser?.firstName ||
                    "You"
                  }
                  avatar={currentUser?.avatar || currentUser?.avatarUrl}
                  userId={currentUser?.id}
                  size="h-6 w-6"
                />
                <Input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a comment or question…"
                  className="h-7 text-xs bg-muted/20"
                />
                <Button
                  type="submit"
                  size="xs"
                  className="h-7 px-2.5 text-xs font-semibold cursor-pointer"
                  loading={isSubmittingComment}
                  disabled={!reply.trim()}
                >
                  Reply
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
export default memo(ClassFeedPost);
