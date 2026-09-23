import { useState } from "react";
import { Link } from "react-router";
import { routes } from "@/routes/paths.js";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";
import {
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
} from "../api/commentApi.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import {
  MoreVertical,
  Pin,
  Trash2,
  Edit3,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Globe,
  ClipboardList,
  BookOpen,
  Calendar,
  Check,
  X,
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

export default function ClassFeedPost({
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
  const [menuOpen, setMenuOpen] = useState(false);
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
    formatPostDate(post.publishedAt || post.createdAt) ||
    post.time ||
    "";

  const isAssignment = post.type === "ASSIGNMENT";
  const isMaterial = post.type === "MATERIAL";
  const attachments = Array.isArray(post.attachments) ? post.attachments : [];

  const { data: comments = [], isLoading: isLoadingComments } =
    useGetCourseworkCommentsQuery(
      { courseworkId: post.id },
      { skip: !commentsOpen || !post?.id },
    );

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
    setMenuOpen(false);
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete?.(post.id);
    }
  };

  const handleTogglePin = () => {
    setMenuOpen(false);
    onPin?.(post.id, !isPinned);
  };

  const submitReply = async (event) => {
    event.preventDefault();
    if (!reply.trim() || !post?.id) return;
    try {
      await addComment({
        courseworkId: post.id,
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
    <article className="relative rounded-xl bg-card p-3 sm:p-4 border border-border/70 shadow-2xs transition-all hover:border-border">
      {/* Pinned Badge */}
      {isPinned && (
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-primary">
          <div className="flex items-center gap-1.5">
            <Pin className="h-3 w-3 fill-primary" />
            <span>Pinned announcement</span>
          </div>
        </div>
      )}

      {/* Assignment / Material Activity Header */}
      {(isAssignment || isMaterial) && (
        <div className="mb-2.5 flex items-center justify-between rounded-lg bg-muted/40 px-2.5 py-1.5 border border-border/50 text-xs">
          <div className="flex items-center gap-2">
            {isAssignment ? (
              <span className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <ClipboardList className="h-3 w-3" /> Assignment
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <BookOpen className="h-3 w-3" /> Material
              </span>
            )}
            {post.maximumPoints != null && (
              <span className="text-[11px] text-muted-foreground">
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
          size="h-8 w-8"
        />

        <div className="min-w-0 flex-1">
          {/* Post Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2">
              {authorId ? (
                <Link
                  to={routes.user(authorId)}
                  className="text-xs font-semibold text-foreground hover:text-primary hover:underline transition-colors"
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
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
                  title="More actions"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-1 w-40 rounded-lg border border-border bg-popover py-1 text-xs text-popover-foreground shadow-md animate-in fade-in zoom-in-95">
                      {isStaff && (
                        <button
                          type="button"
                          onClick={handleTogglePin}
                          className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-muted transition-colors text-left cursor-pointer"
                        >
                          <Pin className="h-3.5 w-3.5 text-primary" />
                          <span>{isPinned ? "Unpin post" : "Pin post"}</span>
                        </button>
                      )}

                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              setIsEditing(true);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-muted transition-colors text-left cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Post Content or Edit Form */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              {post.title && post.title !== "Announcement" && (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground outline-none focus:border-ring"
                  placeholder="Post title"
                />
              )}
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-ring"
                placeholder="Write your update…"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSavingEdit}
                  className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit || !editDescription.trim()}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSavingEdit ? "Saving…" : "Save"}
                </button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachments
                    .filter((a) => a.type === "IMAGE")
                    .map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-lg border border-border/70 bg-muted/30 aspect-video max-h-56"
                      >
                        <img
                          src={att.url}
                          alt={att.title || "Image attachment"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-102"
                          loading="lazy"
                        />
                        {att.title && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] font-medium text-white truncate">
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
                      className="overflow-hidden rounded-lg border border-border/70 aspect-video max-h-72"
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
                      className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/40 p-2.5 text-xs text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <VideoIcon className="h-4 w-4 text-red-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">
                          {att.title || "Video Link"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {att.url}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </a>
                  );
                })}

              {/* File and Link Attachments */}
              {attachments
                .filter((a) => a.type === "FILE" || a.type === "LINK")
                .map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/30 p-2 text-xs text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {att.type === "FILE" ? (
                      <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                    ) : (
                      <Globe className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">
                        {att.title || att.url}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {att.url}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </a>
                ))}
            </div>
          )}

          {/* Discussion / Comments Toggle */}
          <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setCommentsOpen((open) => !open)}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer font-medium text-[11px]"
            >
              <ClassroomIcon name="comment" className="h-3.5 w-3.5" />
              <span>{commentsOpen ? "Hide discussion" : "Discussion"}</span>
              {comments.length > 0 && <span>({comments.length})</span>}
            </button>
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
                      comment.content ||
                      comment.body ||
                      comment.message ||
                      "";
                    const commentTime = formatPostDate(comment.createdAt);

                    return (
                      <div key={comment.id} className="flex gap-2 text-xs">
                        <ClassroomAvatar
                          name={commentAuthor}
                          avatar={commentAvatar}
                          userId={commenterId}
                          size="h-6 w-6"
                        />
                        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5 text-foreground flex-1">
                          <div className="flex items-center justify-between gap-2">
                            {commenterId ? (
                              <Link
                                to={routes.user(commenterId)}
                                className="font-semibold text-foreground text-[11px] hover:text-primary hover:underline transition-colors"
                              >
                                {commentAuthor}
                              </Link>
                            ) : (
                              <span className="font-semibold text-foreground text-[11px]">
                                {commentAuthor}
                              </span>
                            )}
                            {commentTime && (
                              <span className="text-[10px] text-muted-foreground">
                                {commentTime}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-foreground/90 mt-0.5 whitespace-pre-wrap">
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
              <form onSubmit={submitReply} className="mt-2.5 flex items-center gap-2">
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
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a comment or question…"
                  className="min-w-0 flex-1 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/50"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  disabled={!reply.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? "Posting…" : "Reply"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
