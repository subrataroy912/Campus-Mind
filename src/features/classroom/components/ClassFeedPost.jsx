import { useState } from "react";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";
import {
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
} from "../api/commentApi.js";

export default function ClassFeedPost({ post, pinned = false }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reply, setReply] = useState("");

  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.name ||
        post.creatorName ||
        post.teacherName ||
        "Instructor";

  const content = post.description || post.content || post.title || "";
  const displayTime = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : post.time || "";

  const { data: comments = [], isLoading: isLoadingComments } =
    useGetCourseworkCommentsQuery(
      { courseworkId: post.id },
      { skip: !commentsOpen || !post?.id }
    );

  const [addComment, { isLoading: isSubmittingComment }] =
    useAddCourseworkCommentMutation();

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
      console.error("Failed to add announcement comment:", err);
    }
  };

  return (
    <article className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-5">
      {pinned && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-secondary">
          <ClassroomIcon name="pin" className="h-3.5 w-3.5" />
          <span>Pinned announcement</span>
        </div>
      )}
      <div className="flex gap-3">
        <ClassroomAvatar name={authorName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-text-heading">
              {authorName}
            </span>
            {displayTime && (
              <span className="text-xs text-text-muted">{displayTime}</span>
            )}
          </div>
          {post.title && post.title !== "Announcement" && (
            <h4 className="mt-1 text-sm font-bold text-text-heading">
              {post.title}
            </h4>
          )}
          <p className="mt-1 text-sm text-text-main whitespace-pre-wrap">
            {content}
          </p>

          {!pinned && (
            <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
              <button
                type="button"
                onClick={() => setCommentsOpen((open) => !open)}
                className="flex items-center gap-1.5 transition hover:text-primary cursor-pointer font-medium"
              >
                <ClassroomIcon name="comment" className="h-4 w-4" />
                <span>
                  {commentsOpen ? "Hide discussion" : "Discussion"}
                </span>
                {comments.length > 0 && <span>({comments.length})</span>}
              </button>
            </div>
          )}

          {!pinned && commentsOpen && (
            <div className="mt-3 border-t border-border pt-3">
              <div className="space-y-2">
                {isLoadingComments ? (
                  <p className="text-xs text-text-muted">Loading discussion…</p>
                ) : comments.length ? (
                  comments.map((comment) => {
                    const commentAuthor =
                      comment.author?.name ||
                      comment.authorName ||
                      "Class Member";
                    return (
                      <div key={comment.id} className="flex gap-2 text-sm">
                        <ClassroomAvatar name={commentAuthor} size="h-7 w-7" />
                        <div className="rounded-xl bg-canvas px-3 py-2 text-text-main">
                          <span className="font-semibold text-text-heading text-xs">
                            {commentAuthor}{" "}
                          </span>
                          <p className="text-xs sm:text-sm">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-muted">
                    No comments yet. Start the discussion below.
                  </p>
                )}
              </div>

              <form onSubmit={submitReply} className="mt-3 flex gap-2">
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a comment or question…"
                  className="min-w-0 flex-1 rounded-xl border border-border bg-canvas px-3 py-2 text-xs sm:text-sm text-text-main outline-none focus:ring-2 focus:ring-focus"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-surface transition hover:bg-primary-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
