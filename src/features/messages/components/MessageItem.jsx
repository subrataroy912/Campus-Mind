import { Link2, Loader2, SmilePlus, Trash2 } from "lucide-react";
import { formatChatTime } from "@/utils/dateFormat.js";
import { formatLastActive } from "@/utils/formatLastActive.js";
import { SpaceAvatar } from "@/features/spaces/components/SpaceAvatar.jsx";
import { MessageRoleBadge } from "./MessageRoleBadge.jsx";
import { MessageContent } from "./MessageContent.jsx";
import { MessageReactionPicker } from "./MessageReactionPicker.jsx";
import { MessageReactions } from "./MessageReactions.jsx";

export function MessageItem({
  message,
  currentUserId,
  isSpaceModerator = false,
  onlineUserIdsSet,
  userPresenceMap,
  activeEmojiPickerId,
  setActiveEmojiPickerId,
  onDeleteMessage,
  onToggleReaction,
  onOpenLightbox,
}) {
  const senderId = message?.sender?.userId || message?.senderId;
  const isMine = currentUserId && String(senderId) === String(currentUserId);
  const isSenderOnline =
    isMine ||
    (senderId && onlineUserIdsSet?.has(String(senderId))) ||
    Boolean(message?.sender?.online);
  const senderLastActive =
    (senderId && userPresenceMap?.[String(senderId)]?.lastActiveAt) ||
    message?.sender?.lastActiveAt ||
    message?.timestamp;
  const canDelete = isMine || isSpaceModerator;
  const isPickerOpen = activeEmojiPickerId === message?.eventId;

  return (
    <div
      className={`group flex items-start gap-2.5 ${
        isMine ? "justify-end" : "flex-row"
      }`}
    >
      {!isMine && (
        <div
          className="relative shrink-0 mt-0.5"
          title={formatLastActive(senderLastActive, isSenderOnline)}
        >
          <SpaceAvatar
            avatar={message?.sender?.avatarUrl}
            name={message?.sender?.username || "Member"}
            size="h-7 w-7"
          />
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface ${
              isSenderOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
            }`}
          />
        </div>
      )}

      <div
        className={`flex max-w-[85%] sm:max-w-[60ch] flex-col ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        {/* Sender Header */}
        <div className="mb-0.5 flex items-center gap-1.5 px-0.5">
          {!isMine && (
            <>
              <span className="text-[11px] font-semibold text-text-heading">
                {message?.sender?.username || "Space Member"}
              </span>
              <MessageRoleBadge role={message?.sender?.role} />
            </>
          )}
          <span className="text-[10px] text-text-muted">
            {formatChatTime(message?.timestamp)}
          </span>
        </div>

        {/* Message Bubble + Quick Actions */}
        <div
          className={`relative flex items-center gap-1.5 ${
            isMine ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
              isMine
                ? "bg-primary text-primary-foreground rounded-tr-xs"
                : "bg-surface border border-border/70 text-text-heading rounded-tl-xs"
            }`}
          >
            {message?.content && (
              <MessageContent content={message.content} isMine={isMine} />
            )}

            {Array.isArray(message?.attachments) &&
              message.attachments.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {message.attachments.map((att, idx) => {
                    const isImageAttachment =
                      att.type === "IMAGE" ||
                      att.mimeType?.startsWith("image/") ||
                      /^data:image\//i.test(att.url || "") ||
                      /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(att.url || "");
                    const isAttUploading = Boolean(
                      att.isUploading || message.isOptimisticUploading,
                    );

                    return isImageAttachment ? (
                      <div
                        key={`${att.url}-${idx}`}
                        className="relative overflow-hidden rounded-lg border border-border/40"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            !isAttUploading &&
                            onOpenLightbox?.({
                              url: att.url,
                              name: att.name || "Chat image",
                            })
                          }
                          className="block cursor-pointer"
                        >
                          <img
                            src={att.url}
                            alt={att.name || "Attachment"}
                            className={`max-h-56 w-auto object-cover transition ${
                              isAttUploading
                                ? "opacity-70 blur-[1px]"
                                : "opacity-100 hover:opacity-95"
                            }`}
                            loading="lazy"
                          />
                        </button>
                        {isAttUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[11px] font-medium text-white shadow-sm">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Uploading…</span>
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        key={`${att.url}-${idx}`}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium underline ${
                          isMine
                            ? "bg-white/15 text-white"
                            : "bg-canvas text-primary"
                        }`}
                      >
                        <Link2 className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-48">
                          {att.name || att.url}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Hover Actions: React & Delete */}
          <div className="relative flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() =>
                setActiveEmojiPickerId?.(
                  isPickerOpen ? null : message.eventId,
                )
              }
              title="Add reaction"
              className="rounded p-1 text-text-muted hover:bg-surface hover:text-text-heading cursor-pointer"
            >
              <SmilePlus className="h-3.5 w-3.5" />
            </button>

            {canDelete && (
              <button
                type="button"
                onClick={() => onDeleteMessage?.(message.eventId)}
                title="Delete message"
                className="rounded p-1 text-text-muted hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            {isPickerOpen && (
              <MessageReactionPicker
                isMine={isMine}
                onSelectEmoji={(emoji) => {
                  onToggleReaction?.(message.eventId, emoji);
                  setActiveEmojiPickerId?.(null);
                }}
              />
            )}
          </div>
        </div>

        {/* Active Reaction Pills */}
        <MessageReactions
          reactions={message?.reactions}
          currentUserId={currentUserId}
          onToggleReaction={(emoji) =>
            onToggleReaction?.(message.eventId, emoji)
          }
        />
      </div>
    </div>
  );
}
