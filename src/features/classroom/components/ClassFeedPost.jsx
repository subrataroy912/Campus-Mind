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

export default function ClassFeedPost({ post, pinned = false }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reply, setReply] = useState("");
  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.name || post.creatorName || post.ownerName || "Author";
  const authorId =
    (typeof post.author === "object" ? post.author?.id : null) ||
    post.authorId ||
    post.creatorId ||
    post.ownerId ||
    null;

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
      { skip: !commentsOpen || !post?.id },
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
    <article className="rounded-xl bg-card p-3 sm:p-3.5 border border-border/70 shadow-2xs">
      {pinned && (
        <div className="mb-2 flex items-center gap-1 text-[11px] font-medium text-primary">
          <ClassroomIcon name="pin" className="h-3 w-3" />
          <span>Pinned announcement</span>
        </div>
      )}
      <div className="flex gap-2.5">
        <ClassroomAvatar name={authorName} userId={authorId} size="h-7 w-7" />
        <div className="min-w-0 flex-1">
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
            {displayTime && (
              <span className="text-[11px] text-muted-foreground">
                {displayTime}
              </span>
            )}
          </div>
          {post.title && post.title !== "Announcement" && (
            <h4 className="mt-0.5 text-xs font-semibold text-foreground">
              {post.title}
            </h4>
          )}
          <p className="mt-1 text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>

          {!pinned && (
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
          )}

          {!pinned && commentsOpen && (
            <div className="mt-2.5 border-t border-border/50 pt-2.5">
              <div className="space-y-1.5">
                {isLoadingComments ? (
                  <p className="text-[11px] text-muted-foreground">
                    Loading discussion…
                  </p>
                ) : comments.length ? (
                  comments.map((comment) => {
                    const commentAuthor =
                      comment.author?.name ||
                      comment.authorName ||
                      "Class Member";
                    const commenterId =
                      comment.author?.id ||
                      comment.authorId ||
                      comment.userId ||
                      null;
                    return (
                      <div key={comment.id} className="flex gap-2 text-xs">
                        <ClassroomAvatar
                          name={commentAuthor}
                          userId={commenterId}
                          size="h-6 w-6"
                        />
                        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5 text-foreground flex-1">
                          {commenterId ? (
                            <Link
                              to={routes.user(commenterId)}
                              className="font-semibold text-foreground text-[11px] hover:text-primary hover:underline transition-colors"
                            >
                              {commentAuthor}
                            </Link>
                          ) : (
                            <span className="font-semibold text-foreground text-[11px]">
                              {commentAuthor}{" "}
                            </span>
                          )}
                          <p className="text-xs text-foreground/90 mt-0.5">
                            {comment.content}
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

              <form onSubmit={submitReply} className="mt-2 flex gap-1.5">
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
