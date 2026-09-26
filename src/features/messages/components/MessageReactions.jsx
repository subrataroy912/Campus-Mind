export function MessageReactions({
  reactions,
  currentUserId,
  onToggleReaction,
}) {
  if (!reactions) return null;

  const reactionEntries = Object.entries(reactions).filter(
    ([, userIds]) => Array.isArray(userIds) && userIds.length > 0,
  );

  if (reactionEntries.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {reactionEntries.map(([emoji, userIds]) => {
        const hasReacted =
          currentUserId &&
          userIds.some((id) => String(id) === String(currentUserId));
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onToggleReaction?.(emoji)}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
              hasReacted
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/70 bg-surface text-text-muted hover:text-text-heading"
            }`}
          >
            <span>{emoji}</span>
            <span>{userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
}
