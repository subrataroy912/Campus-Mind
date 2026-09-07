import { useState } from "react";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassFeedPost({ post, pinned = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState(post.commentList || []);
  const [reply, setReply] = useState("");

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };
  const submitReply = (event) => {
    event.preventDefault();
    if (!reply.trim()) return;
    setComments((items) => [...items, { id: Date.now(), author: "You", content: reply.trim() }]);
    setReply("");
  };

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-5">
      {pinned && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-secondary">
          <ClassroomIcon name="pin" className="h-3.5 w-3.5" />
          Pinned announcement
        </div>
      )}
      <div className="flex gap-3">
        <ClassroomAvatar name={post.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-medium text-text-heading">{post.author}</span>
            <span className="text-xs text-text-muted">{post.time}</span>
          </div>
          <p className="mt-1 text-sm text-text-main">{post.content}</p>

          {!pinned && (
            <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1.5 transition hover:text-primary ${liked ? "text-primary" : ""}`}
              >
                <ClassroomIcon name="like" className="h-4 w-4" />
                {likeCount}
              </button>
              <button onClick={() => setCommentsOpen((open) => !open)} className="flex items-center gap-1.5 transition hover:text-primary">
                <ClassroomIcon name="comment" className="h-4 w-4" />
                {comments.length || post.comments}
              </button>
            </div>
          )}
          {!pinned && commentsOpen && <div className="mt-3 border-t border-border pt-3"><div className="space-y-2">{comments.length ? comments.map((comment) => <div key={comment.id} className="flex gap-2 text-sm"><ClassroomAvatar name={comment.author} size="h-7 w-7" /><p className="rounded-lg bg-canvas px-2.5 py-1.5 text-text-main"><span className="font-medium text-text-heading">{comment.author} </span>{comment.content}</p></div>) : <p className="text-xs text-text-muted">No comments yet.</p>}</div><form onSubmit={submitReply} className="mt-3 flex gap-2"><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply…" className="min-w-0 flex-1 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-text-main outline-none focus:ring-2 focus:ring-focus" /><button className="rounded-lg bg-primary px-3 text-sm font-medium text-surface disabled:opacity-50" disabled={!reply.trim()}>Reply</button></form></div>}
        </div>
      </div>
    </div>
  );
}
