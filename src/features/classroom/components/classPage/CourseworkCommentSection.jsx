import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  useAddCourseworkCommentMutation,
  useGetCourseworkCommentsQuery,
} from "../../api/commentApi.js";

export function CourseworkCommentSection({ courseId, courseworkId }) {
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const { data: courseworkComments = [] } = useGetCourseworkCommentsQuery(
    { courseId, courseworkId },
    { skip: !courseId || !courseworkId }
  );

  const [addCourseworkComment, { isLoading: isPosting }] =
    useAddCourseworkCommentMutation();

  const handleAddComment = async () => {
    const content = commentText.trim();
    if (!content || !courseId || !courseworkId) return;
    setCommentError("");

    try {
      await addCourseworkComment({
        courseId,
        courseworkId,
        payload: { content },
      }).unwrap();
      setCommentText("");
    } catch (requestError) {
      setCommentError(requestError?.message || "Unable to post this comment.");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 space-y-3">
      <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
        Class Discussion
      </p>
      {courseworkComments.length === 0 ? (
        <p className="text-xs text-text-muted">No comments yet.</p>
      ) : (
        <div className="space-y-2">
          {courseworkComments.map((comment, idx) => (
            <div
              key={comment.id ?? `${courseworkId}-${idx}`}
              className="rounded-lg bg-canvas px-3 py-2 text-xs"
            >
              <p className="font-semibold text-text-heading">
                {comment.author?.name || comment.authorName || "Class Member"}
              </p>
              <p className="mt-0.5 text-text-main">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
          className="flex-1 rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs text-text-heading outline-none focus:ring-2 focus:ring-focus"
          placeholder="Add a class comment…"
        />
        <Button size="sm" loading={isPosting} onClick={handleAddComment}>
          Post
        </Button>
      </div>
      {commentError && (
        <p className="text-xs text-secondary font-medium">{commentError}</p>
      )}
    </div>
  );
}
