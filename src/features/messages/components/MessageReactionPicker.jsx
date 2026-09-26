import { QUICK_EMOJIS } from "../constants/messageConstants.js";

export function MessageReactionPicker({ onSelectEmoji, isMine = false }) {
  return (
    <div
      role="dialog"
      aria-label="Reaction picker"
      className={`absolute bottom-full mb-2 z-20 grid grid-cols-6 gap-1 rounded-xl border border-border bg-surface p-2 shadow-md w-max max-w-[240px] ${
        isMine ? "right-0" : "left-0"
      }`}
    >
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelectEmoji(emoji)}
          className="hover:scale-125 transition-transform text-base p-1 cursor-pointer flex items-center justify-center rounded hover:bg-canvas"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
