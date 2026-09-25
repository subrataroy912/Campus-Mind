import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ExternalLink,
  History,
  ImagePlus,
  Link2,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Send,
  Shield,
  SmilePlus,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import {
  useDeleteSpaceMessageMutation,
  useGetSpaceChatHistoryQuery,
  useGetSpaceChatRoomsQuery,
  useLazyGetSpaceChatHistoryQuery,
  useMarkSpaceChatReadMutation,
  useUploadSpaceChatImageMutation,
} from "@/features/messages/api/messagesApi.js";
import { useSpaceStompChat } from "@/features/messages/hooks/useSpaceStompChat.js";
import { selectCurrentUserId } from "@/features/auth/authSelectors.js";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { routes } from "@/routes/paths.js";
import { fileToDataUrl, optimizeImage } from "@/utils/optimizeImage.js";

const QUICK_EMOJIS = ["👍", "❤️", "🚀", "🔥", "🎉"];

function formatChatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function RoleBadge({ role }) {
  const normalized = (role || "").toUpperCase();
  if (normalized === "OWNER") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
        <Shield className="h-2.5 w-2.5" />
        Owner
      </span>
    );
  }
  if (normalized === "ADMIN") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wide text-primary">
        <Shield className="h-2.5 w-2.5" />
        Admin
      </span>
    );
  }
  return null;
}

function SpaceRoomListItem({ room, active, onSelect }) {
  const lastMsg = room.lastMessage;
  const senderPrefix =
    room.lastMessageSender || lastMsg?.sender?.username
      ? `${room.lastMessageSender || lastMsg?.sender?.username}: `
      : "";
  const bodyPreview =
    room.lastMessageText ||
    lastMsg?.content ||
    (lastMsg?.attachments?.length ? "Shared an attachment" : "");
  const previewText = bodyPreview
    ? `${senderPrefix}${bodyPreview}`
    : "No messages yet — say hello!";
  const lastTime = room.lastMessageAt || lastMsg?.timestamp;
  const roomSubtitle = room.subtitle || room.section || room.subject || "";

  return (
    <button
      type="button"
      onClick={() => onSelect(room.spaceId)}
      className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition cursor-pointer ${
        active
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "hover:bg-canvas/70 text-text-main"
      }`}
    >
      <ClassroomAvatar
        avatar={room.logoUrl}
        name={room.title}
        size="h-9 w-9"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-1.5">
          <span
            className={`truncate text-xs font-semibold ${
              active ? "text-primary" : "text-text-heading"
            }`}
          >
            {room.title}
          </span>
          {lastTime && (
            <span className="shrink-0 text-[10px] text-text-muted">
              {formatChatTime(lastTime)}
            </span>
          )}
        </span>

        {roomSubtitle && (
          <span className="block truncate text-[11px] text-text-muted">
            {roomSubtitle}
          </span>
        )}

        <span className="mt-0.5 flex items-center justify-between gap-1.5">
          <span className="truncate text-xs text-text-muted">
            {previewText}
          </span>
          {room.unreadCount > 0 && !active && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

function SpaceChatThread({ room, currentUserId, onBack }) {
  const [draft, setDraft] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [olderMessages, setOlderMessages] = useState([]);
  const [olderCursor, setOlderCursor] = useState(null);
  const [hasOlderMore, setHasOlderMore] = useState(null);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState(() => new Set());
  const [activeEmojiPickerId, setActiveEmojiPickerId] = useState(null);

  const messagesEndRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const imageInputRef = useRef(null);

  const {
    data: initialHistory,
    isLoading: isHistoryLoading,
  } = useGetSpaceChatHistoryQuery(
    { spaceId: room.spaceId, limit: 30 },
    { skip: !room.spaceId },
  );

  const [fetchOlderPage, { isFetching: isFetchingOlder }] =
    useLazyGetSpaceChatHistoryQuery();
  const [deleteSpaceMessage] = useDeleteSpaceMessageMutation();
  const [markSpaceChatRead] = useMarkSpaceChatReadMutation();
  const [uploadSpaceChatImage] = useUploadSpaceChatImageMutation();

  const {
    liveEvents = [],
    reactionPatches = {},
    deletedEventIds = [],
    typingUsers = [],
    isConnected,
    sendMessage: sendStompMessage,
    toggleReaction,
    notifyTyping,
  } = useSpaceStompChat(room.spaceId);

  // Mark chat read on room open and when new live events arrive
  useEffect(() => {
    if (!room.spaceId) return;
    markSpaceChatRead(room.spaceId);
  }, [room.spaceId, liveEvents.length, markSpaceChatRead]);

  const effectiveCursor =
    olderCursor !== null ? olderCursor : (initialHistory?.nextCursor ?? null);
  const effectiveHasMore =
    hasOlderMore !== null
      ? hasOlderMore
      : Boolean(initialHistory?.hasMore && initialHistory?.nextCursor);

  const handleLoadOlder = async () => {
    if (!effectiveCursor || isFetchingOlder) return;
    shouldAutoScrollRef.current = false;
    try {
      const res = await fetchOlderPage({
        spaceId: room.spaceId,
        before: effectiveCursor,
        limit: 30,
      }).unwrap();
      const fetched = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.messages)
          ? res.messages
          : [];
      setOlderMessages((prev) => [...fetched, ...prev]);
      setOlderCursor(res?.nextCursor ?? null);
      setHasOlderMore(Boolean(res?.hasMore && res?.nextCursor));
    } catch {
      // Ignore transient pagination error
    }
  };

  // Merge older pages + initial history + live STOMP events
  const mergedMessages = useMemo(() => {
    const baseHistory = Array.isArray(initialHistory?.items)
      ? initialHistory.items
      : Array.isArray(initialHistory?.messages)
        ? initialHistory.messages
        : [];
    const combined = [...olderMessages, ...baseHistory, ...liveEvents];
    const byId = new Map();

    for (const msg of combined) {
      if (
        !msg?.eventId ||
        locallyDeletedIds.has(msg.eventId) ||
        deletedEventIds.includes(msg.eventId)
      ) {
        continue;
      }
      const patchedReactions = reactionPatches[msg.eventId];
      byId.set(
        msg.eventId,
        patchedReactions ? { ...msg, reactions: patchedReactions } : msg,
      );
    }

    return Array.from(byId.values()).sort(
      (a, b) =>
        new Date(a.timestamp || 0).getTime() -
        new Date(b.timestamp || 0).getTime(),
    );
  }, [
    olderMessages,
    initialHistory,
    liveEvents,
    locallyDeletedIds,
    deletedEventIds,
    reactionPatches,
  ]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    shouldAutoScrollRef.current = true;
  }, [mergedMessages.length]);

  const userRole = (room.myRole || room.userRole || "").toUpperCase();
  const isSpaceModerator = userRole === "OWNER" || userRole === "ADMIN";
  const roomSubtitle = room.subtitle || room.section || room.subject || "";

  const handleInputChange = (e) => {
    setDraft(e.target.value);
    if (e.target.value.trim()) {
      notifyTyping();
    }
  };

  const applySelectedImage = (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      setImageUploadError("Please select an image file (JPG, PNG, GIF, or WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError("Image must be smaller than 10 MB.");
      return;
    }
    setImageUploadError(null);
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSelectedImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      applySelectedImage(file);
    }
    event.target.value = "";
  };

  const handleClearImageFile = () => {
    setSelectedImageFile(null);
    setSelectedImagePreview(null);
    setImageUploadError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type?.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          event.preventDefault();
          applySelectedImage(file);
          break;
        }
      }
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (isUploadingImage) return;

    const text = draft.trim();
    const cleanUrl = attachmentUrl.trim();
    if (!text && !cleanUrl && !selectedImageFile) return;

    const attachments = [];

    if (selectedImageFile) {
      setIsUploadingImage(true);
      setImageUploadError(null);
      try {
        const optimizedFile = await optimizeImage(selectedImageFile, {
          maxDimension: 1600,
          quality: 0.85,
        });
        let uploadedAttachment = null;
        try {
          uploadedAttachment = await uploadSpaceChatImage({
            spaceId: room.spaceId,
            file: optimizedFile,
          }).unwrap();
        } catch {
          const dataUrl = await fileToDataUrl(optimizedFile);
          uploadedAttachment = {
            url: dataUrl,
            name: selectedImageFile.name || "chat-image.webp",
            type: "IMAGE",
            mimeType: optimizedFile.type || "image/webp",
            size: optimizedFile.size,
          };
        }

        if (uploadedAttachment?.url) {
          attachments.push({
            url: uploadedAttachment.url,
            name:
              uploadedAttachment.name ||
              selectedImageFile.name ||
              "chat-image.webp",
            type: "IMAGE",
            mimeType:
              uploadedAttachment.mimeType ||
              optimizedFile.type ||
              "image/webp",
            size: uploadedAttachment.size || optimizedFile.size,
          });
        }
      } catch (err) {
        setImageUploadError(
          err?.data?.message || err?.message || "Failed to process image.",
        );
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    if (cleanUrl) {
      const isImgUrl =
        /^data:image\//i.test(cleanUrl) ||
        /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(cleanUrl);
      attachments.push({
        url: cleanUrl,
        name: attachmentName.trim() || cleanUrl,
        type: isImgUrl ? "IMAGE" : "LINK",
        mimeType: isImgUrl ? "image/webp" : undefined,
      });
    }

    const sent = sendStompMessage({
      content: text,
      attachments,
    });

    if (sent) {
      setDraft("");
      setAttachmentUrl("");
      setAttachmentName("");
      setShowAttachmentInput(false);
      handleClearImageFile();
      shouldAutoScrollRef.current = true;
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;
    setLocallyDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(messageId);
      return next;
    });
    try {
      await deleteSpaceMessage({
        spaceId: room.spaceId,
        messageId,
      }).unwrap();
    } catch {
      // Revert if deletion failed
      setLocallyDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
    }
  };

  const visibleTypingUsers = useMemo(
    () =>
      typingUsers.filter(
        (u) => u.userId && String(u.userId) !== String(currentUserId),
      ),
    [typingUsers, currentUserId],
  );

  return (
    <div className="flex h-full w-full flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-2.5 border-b border-border/70 px-3 py-2.5 bg-surface">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="min-h-9 min-w-9 sm:min-h-8 sm:min-w-8 inline-flex items-center justify-center rounded-md p-1 text-text-main hover:bg-canvas lg:hidden cursor-pointer"
            aria-label="Back to space chats"
          >
            <ArrowLeft size={18} />
          </button>
          <ClassroomAvatar
            avatar={room.logoUrl}
            name={room.title}
            size="h-8 w-8"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs sm:text-sm font-semibold text-text-heading">
                {room.title}
              </p>
              <RoleBadge role={userRole} />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="inline-flex items-center gap-1">
                {isConnected ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <Wifi className="h-3 w-3 text-emerald-500" />
                    <span>Live chat</span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <WifiOff className="h-3 w-3 text-amber-500" />
                    <span>Connecting…</span>
                  </>
                )}
              </span>
              {roomSubtitle && (
                <>
                  <span>•</span>
                  <span className="truncate">{roomSubtitle}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Link
          to={routes.spaces.detail(room.spaceId)}
          className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-canvas px-2.5 py-1 text-[11px] font-medium text-text-heading hover:border-primary/40 hover:text-primary transition shrink-0"
        >
          <span>View Space</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4 bg-canvas/30">
        {!isSpaceModerator &&
          (initialHistory?.joinedAt || room.joinedAt) &&
          !effectiveHasMore && (
            <div className="flex justify-center pb-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/90 px-3 py-1 text-[11px] text-text-muted shadow-2xs">
                <History className="h-3 w-3 text-primary shrink-0" />
                <span>
                  You joined on{" "}
                  {new Date(
                    initialHistory?.joinedAt || room.joinedAt,
                  ).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  — earlier messages are not visible
                </span>
              </div>
            </div>
          )}

        {effectiveHasMore && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={handleLoadOlder}
              disabled={isFetchingOlder}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1 text-[11px] font-medium text-text-muted hover:text-text-heading hover:bg-canvas transition cursor-pointer disabled:opacity-50"
            >
              <History className="h-3 w-3" />
              <span>
                {isFetchingOlder
                  ? "Loading earlier messages…"
                  : "Load earlier messages"}
              </span>
            </button>
          </div>
        )}

        {isHistoryLoading ? (
          <div className="grid h-40 place-items-center text-xs text-text-muted">
            Loading conversation history…
          </div>
        ) : mergedMessages.length === 0 ? (
          <div className="grid h-48 place-items-center text-center px-4">
            <div className="max-w-xs space-y-1.5">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-text-heading">
                Welcome to {room.title} Chat
              </p>
              <p className="text-[11px] text-text-muted">
                Start a live discussion with everyone enrolled in this space.
              </p>
            </div>
          </div>
        ) : (
          mergedMessages.map((message) => {
            const isMine =
              currentUserId &&
              String(message.sender?.userId) === String(currentUserId);
            const canDelete = isMine || isSpaceModerator;
            const reactionsMap = message.reactions || {};
            const reactionEntries = Object.entries(reactionsMap).filter(
              ([, users]) => Array.isArray(users) && users.length > 0,
            );

            return (
              <div
                key={message.eventId}
                className={`group flex items-start gap-2.5 ${
                  isMine ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <ClassroomAvatar
                  avatar={message.sender?.avatarUrl}
                  name={message.sender?.username || "Member"}
                  size="h-7 w-7 shrink-0 mt-0.5"
                />

                <div
                  className={`flex max-w-[82%] sm:max-w-[72%] flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Header */}
                  <div className="mb-0.5 flex items-center gap-1.5 px-0.5">
                    <span className="text-[11px] font-semibold text-text-heading">
                      {isMine
                        ? "You"
                        : message.sender?.username || "Space Member"}
                    </span>
                    <RoleBadge role={message.sender?.role} />
                    <span className="text-[10px] text-text-muted">
                      {formatChatTime(message.timestamp)}
                    </span>
                  </div>

                  {/* Message Bubble + Quick Actions */}
                  <div className="relative flex items-center gap-1.5">
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                        isMine
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : "bg-surface border border-border/70 text-text-heading rounded-tl-xs"
                      }`}
                    >
                      {message.content && (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}

                      {Array.isArray(message.attachments) &&
                        message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {message.attachments.map((att, idx) => {
                              const isImageAttachment =
                                att.type === "IMAGE" ||
                                att.mimeType?.startsWith("image/") ||
                                /^data:image\//i.test(att.url || "") ||
                                /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(
                                  att.url || "",
                                );
                              return isImageAttachment ? (
                                <a
                                  key={`${att.url}-${idx}`}
                                  href={att.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block overflow-hidden rounded-lg border border-border/40"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name || "Attachment"}
                                    className="max-h-56 w-auto object-cover"
                                    loading="lazy"
                                  />
                                </a>
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
                          setActiveEmojiPickerId((prev) =>
                            prev === message.eventId ? null : message.eventId,
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
                          onClick={() => handleDeleteMessage(message.eventId)}
                          title="Delete message"
                          className="rounded p-1 text-text-muted hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {activeEmojiPickerId === message.eventId && (
                        <div
                          className={`absolute bottom-full mb-1 z-20 flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 shadow-md ${
                            isMine ? "right-0" : "left-0"
                          }`}
                        >
                          {QUICK_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                toggleReaction(message.eventId, emoji);
                                setActiveEmojiPickerId(null);
                              }}
                              className="hover:scale-125 transition-transform text-sm px-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Reaction Pills */}
                  {reactionEntries.length > 0 && (
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {reactionEntries.map(([emoji, userIds]) => {
                        const hasReacted =
                          currentUserId &&
                          userIds.some(
                            (id) => String(id) === String(currentUserId),
                          );
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() =>
                              toggleReaction(message.eventId, emoji)
                            }
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
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ephemeral Typing Status Bar */}
      {visibleTypingUsers.length > 0 && (
        <div className="border-t border-border/40 bg-surface/90 px-3.5 py-1 text-[11px] text-text-muted flex items-center gap-1.5">
          <span className="inline-flex gap-0.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
          </span>
          <span>
            {visibleTypingUsers.map((u) => u.username).join(", ")}{" "}
            {visibleTypingUsers.length === 1 ? "is" : "are"} typing…
          </span>
        </div>
      )}

      {/* Selected Image Preview Drawer */}
      {(selectedImagePreview || imageUploadError) && (
        <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-canvas/60 px-3 py-2">
          {selectedImagePreview ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={selectedImagePreview}
                alt={selectedImageFile?.name || "Selected preview"}
                className="h-12 w-12 rounded-md border border-border/70 object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-text-heading">
                  {selectedImageFile?.name || "Image attached"}
                </p>
                {imageUploadError ? (
                  <p className="text-[11px] text-destructive">
                    {imageUploadError}
                  </p>
                ) : (
                  <p className="text-[11px] text-text-muted">
                    {isUploadingImage
                      ? "Uploading image…"
                      : "Ready to send"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-destructive">{imageUploadError}</p>
          )}
          <button
            type="button"
            onClick={handleClearImageFile}
            disabled={isUploadingImage}
            className="rounded p-1 text-text-muted hover:text-text-heading cursor-pointer disabled:opacity-50"
            aria-label="Remove selected image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Optional Attachment Input Drawer */}
      {showAttachmentInput && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border/70 bg-canvas/60 px-3 py-2">
          <Link2 className="h-3.5 w-3.5 text-text-muted shrink-0" />
          <input
            type="url"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Paste attachment or image URL (https://…)"
            className="flex-1 min-w-44 h-7 rounded border border-border/70 bg-surface px-2 text-xs text-text-heading outline-none focus:border-primary"
          />
          <input
            type="text"
            value={attachmentName}
            onChange={(e) => setAttachmentName(e.target.value)}
            placeholder="Label (optional)"
            className="w-36 h-7 rounded border border-border/70 bg-surface px-2 text-xs text-text-heading outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => {
              setShowAttachmentInput(false);
              setAttachmentUrl("");
              setAttachmentName("");
            }}
            className="rounded p-1 text-text-muted hover:text-text-heading cursor-pointer"
            aria-label="Close attachment input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Message Composer */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-border/70 p-2.5 bg-surface"
      >
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageFileSelect}
          className="sr-only"
          tabIndex={-1}
        />

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploadingImage}
          title="Upload image"
          aria-label="Upload image"
          className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md border transition cursor-pointer disabled:opacity-50 ${
            selectedImageFile
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 bg-canvas text-text-muted hover:text-text-heading"
          }`}
        >
          <ImagePlus size={15} />
        </button>

        <button
          type="button"
          onClick={() => setShowAttachmentInput((prev) => !prev)}
          title="Attach link or media URL"
          aria-label="Attach link or media URL"
          className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md border transition cursor-pointer ${
            showAttachmentInput
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 bg-canvas text-text-muted hover:text-text-heading"
          }`}
        >
          <Plus size={15} />
        </button>

        <input
          type="text"
          value={draft}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder={`Message ${room.title}…`}
          className="flex-1 h-9 sm:h-8 rounded-md border border-border/70 bg-canvas px-3 text-base sm:text-xs text-text-heading outline-none placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-focus"
        />

        <Button
          type="submit"
          size="icon"
          disabled={
            isUploadingImage ||
            (!draft.trim() && !attachmentUrl.trim() && !selectedImageFile)
          }
          aria-label="Send message"
          className="min-h-9 min-w-9 sm:h-8 sm:w-8"
        >
          {isUploadingImage ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send size={13} aria-hidden="true" />
          )}
        </Button>
      </form>
    </div>
  );
}

export default function DashboardMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSpaceId = searchParams.get("space");
  const currentUserId = useSelector(selectCurrentUserId);

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useGetSpaceChatRoomsQuery();

  const [query, setQuery] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState(
    () => requestedSpaceId || null,
  );

  const effectiveSpaceId =
    requestedSpaceId ||
    selectedSpaceId ||
    (rooms.length > 0 &&
    typeof window !== "undefined" &&
    window.innerWidth >= 1024
      ? rooms[0].spaceId
      : null);

  const handleSelectSpace = (spaceId) => {
    setSelectedSpaceId(spaceId);
    if (spaceId) {
      setSearchParams({ space: spaceId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter(
      (room) =>
        (room.title || "").toLowerCase().includes(q) ||
        (room.subtitle || "").toLowerCase().includes(q),
    );
  }, [rooms, query]);

  const activeRoom = useMemo(
    () => rooms.find((room) => room.spaceId === effectiveSpaceId) || null,
    [rooms, effectiveSpaceId],
  );

  if (isLoading) {
    return (
      <div className="grid min-h-64 place-items-center text-xs text-text-muted">
        Loading space chat rooms…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-4">
        <EmptyState
          title="We could not load your space chats"
          description="Please check your connection and try again."
        />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
        <header className="mb-2">
          <h1 className="text-base font-semibold tracking-tight text-text-heading">
            Space Group Chats
          </h1>
          <p className="text-xs text-text-muted">
            Every space you join includes a dedicated real-time group chat for
            members and instructors.
          </p>
        </header>
        <EmptyState
          title="No enrolled spaces yet"
          description="Join or create a space to collaborate in its live group chat."
          action={{ to: routes.spaces.list, label: "Browse spaces" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-7xl flex-col p-2 sm:p-3">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-xl border border-border/80 bg-surface shadow-xs lg:grid-cols-[300px_1fr]">
        {/* Left Sidebar: Space Chat Rooms */}
        <div
          className={`flex min-h-0 flex-col border-border/70 lg:border-r ${
            activeRoom ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-border/70 p-2.5 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Space Channels ({rooms.length})
              </h2>
            </div>
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search space chats…"
                className="h-8 w-full rounded-md border border-border/70 bg-canvas py-1.5 pl-8 pr-2.5 text-base sm:text-xs text-text-heading outline-none focus:border-primary focus:ring-1 focus:ring-focus placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-1.5">
            {filteredRooms.map((room) => (
              <SpaceRoomListItem
                key={room.spaceId}
                room={room}
                active={room.spaceId === activeRoom?.spaceId}
                onSelect={handleSelectSpace}
              />
            ))}
          </div>
        </div>

        {/* Right Pane: Active Space Chat Thread */}
        <div
          className={`min-h-0 ${activeRoom ? "flex" : "hidden lg:flex"}`}
        >
          {activeRoom ? (
            <SpaceChatThread
              key={activeRoom.spaceId}
              room={activeRoom}
              currentUserId={currentUserId}
              onBack={() => handleSelectSpace(null)}
            />
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center text-xs text-text-muted">
              Select a space channel on the left to join the live conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

