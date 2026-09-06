import { useState } from "react";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassFeedPost({ post, pinned = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
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
              <button className="flex items-center gap-1.5 transition hover:text-primary">
                <ClassroomIcon name="comment" className="h-4 w-4" />
                {post.comments}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
