import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  History,
  ImagePlus,
  Link2,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Shield,
  SmilePlus,
  Trash2,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

import SearchInput from "@/components/common/SearchInput.jsx";
import { SpaceAvatar } from "@/features/spaces/components/SpaceAvatar.jsx";
import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import ErrorState from "@/components/common/ErrorState.jsx";
import { ChatLayoutSkeleton } from "@/components/common/LoadingState.jsx";
import { formatChatTime } from "@/utils/dateFormat.js";
import {
  classroomApi,
  useGetClassroomRosterQuery,
} from "@/features/spaces/api/classroomApi.js";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/common/EmptyState.jsx";
import { routes } from "@/routes/paths.js";
import { formatLastActive } from "@/utils/formatLastActive.js";
import {
  fileToDataUrl,
  formatFileSize,
  IMAGE_PROFILES,
  MAX_RAW_IMAGE_BYTES,
  optimizeImage,
} from "@/utils/optimizeImage.js";

const QUICK_EMOJIS = [
  "👍",
  "❤️",
  "🚀",
  "🔥",
  "🎉",
  "👀",
  "🙌",
  "💯",
  "✨",
  "👏",
  "💡",
  "😂",
  "🤔",
  "✅",
  "📌",
  "✍️",
  "💬",
  "⏳",
  "🙏",
  "🎯",
  "💪",
  "🎈",
  "😎",
  "💥",
  "🤫",
  "📢",
];

const SEND_COOLDOWN_MS = 1500;
const MAX_MESSAGE_LENGTH = 2000;
const MESSAGE_COLLAPSE_CHAR_LIMIT = 340;
const MESSAGE_COLLAPSE_LINE_LIMIT = 6;

function splitIntoReadableParagraphs(text) {
  const normalized = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!normalized) return [];

  const rawParagraphs = normalized.split(/\n{2,}/);
  const result = [];

  for (const block of rawParagraphs) {
    // If a single paragraph has no newlines at all and is very long (> 380 chars),
    // group every ~3 sentences into readable paragraphs with line gaps
    if (!block.includes("\n") && block.length > 380) {
      const sentences = block.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [
        block,
      ];
      let currentChunk = "";
      let sentenceCount = 0;
      for (const sentence of sentences) {
        currentChunk += sentence;
        sentenceCount += 1;
        if (sentenceCount >= 3 && currentChunk.length >= 220) {
          result.push(currentChunk.trim());
          currentChunk = "";
          sentenceCount = 0;
        }
      }
      if (currentChunk.trim()) {
        result.push(currentChunk.trim());
      }
    } else {
      result.push(block);
    }
  }

  return result;
}

function FormattedMessageContent({ content, isMine }) {
  const [expanded, setExpanded] = useState(false);

  const normalized = useMemo(
    () =>
      String(content || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    [content],
  );

  const lines = useMemo(() => normalized.split("\n"), [normalized]);
  const isLong =
    normalized.length > MESSAGE_COLLAPSE_CHAR_LIMIT ||
    lines.length > MESSAGE_COLLAPSE_LINE_LIMIT;

  const displayedText = useMemo(() => {
    if (!isLong || expanded) {
      return normalized;
    }
    let slice = normalized;
    if (lines.length > MESSAGE_COLLAPSE_LINE_LIMIT) {
      slice = lines.slice(0, MESSAGE_COLLAPSE_LINE_LIMIT).join("\n");
    }
    if (slice.length > MESSAGE_COLLAPSE_CHAR_LIMIT) {
      const cut = slice.slice(0, MESSAGE_COLLAPSE_CHAR_LIMIT);
      const lastSpace = cut.lastIndexOf(" ");
      slice = lastSpace > 180 ? cut.slice(0, lastSpace) : cut;
    }
    return `${slice.trimEnd()}…`;
  }, [normalized, lines, isLong, expanded]);

  const paragraphs = useMemo(
    () => splitIntoReadableParagraphs(displayedText),
    [displayedText],
  );

  return (
    <div>
      <div className="space-y-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="whitespace-pre-wrap break-words">
            {para}
          </p>
        ))}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition cursor-pointer ${
            isMine
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              <span>Read more</span>
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
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
  const onlineCount = Math.max(
    1,
    Number(room.onlineCount) ||
      (Array.isArray(room.onlineUserIds) ? room.onlineUserIds.length : 1),
  );

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
      <div className="relative shrink-0">
        <SpaceAvatar avatar={room.logoUrl} name={room.title} size="h-9 w-9" />
        <span
          title={`${onlineCount} online`}
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500"
        />
      </div>
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

        <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {onlineCount} online
          </span>
          {roomSubtitle && (
            <>
              <span>•</span>
              <span className="truncate">{roomSubtitle}</span>
            </>
          )}
        </span>

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
  const [sendCooldownLeftMs, setSendCooldownLeftMs] = useState(0);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const imageInputRef = useRef(null);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  const startSendCooldown = () => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
    }
    const expiresAt = Date.now() + SEND_COOLDOWN_MS;
    setSendCooldownLeftMs(SEND_COOLDOWN_MS);
    cooldownTimerRef.current = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setSendCooldownLeftMs(remaining);
      if (remaining <= 0 && cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
    }, 100);
  };

  const {
    data: initialHistory,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useGetSpaceChatHistoryQuery(
    { spaceId: room.spaceId, limit: 30 },
    {
      skip: !room.spaceId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    },
  );

  const [fetchOlderPage, { isFetching: isFetchingOlder }] =
    useLazyGetSpaceChatHistoryQuery();
  const [deleteSpaceMessage] = useDeleteSpaceMessageMutation();
  const [markSpaceChatRead] = useMarkSpaceChatReadMutation();
  const [uploadSpaceChatImage] = useUploadSpaceChatImageMutation();

  const { data: spaceRoster = [] } = useGetClassroomRosterQuery(room.spaceId, {
    skip: !room.spaceId,
    refetchOnMountOrArgChange: 120,
  });

  const {
    liveEvents = [],
    reactionPatches = {},
    deletedEventIds = [],
    typingUsers = [],
    onlineUserIds: stompOnlineUserIds = [],
    userPresenceMap = {},
    isConnected,
    sendMessage: sendStompMessage,
    toggleReaction,
    notifyTyping,
  } = useSpaceStompChat(room.spaceId);

  // Mark chat read only when unread messages exist on room open or when a live message from another user arrives (debounced)
  const lastLiveEvent = liveEvents[liveEvents.length - 1] || null;
  const lastLiveSenderId =
    lastLiveEvent?.sender?.userId || lastLiveEvent?.senderId || null;

  useEffect(() => {
    if (!room.spaceId) return undefined;
    const hasInitialUnread = (room.unreadCount || 0) > 0;
    const isFromOtherUser =
      lastLiveSenderId && String(lastLiveSenderId) !== String(currentUserId);

    if (!hasInitialUnread && !isFromOtherUser) {
      return undefined;
    }

    const timer = setTimeout(
      () => {
        markSpaceChatRead(room.spaceId);
      },
      isFromOtherUser ? 800 : 150,
    );

    return () => clearTimeout(timer);
  }, [
    room.spaceId,
    room.unreadCount,
    lastLiveEvent?.eventId,
    lastLiveSenderId,
    currentUserId,
    markSpaceChatRead,
  ]);

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

  // Merge older pages + initial history + live STOMP events + optimistic pending messages
  const mergedMessages = useMemo(() => {
    const baseHistory = Array.isArray(initialHistory?.items)
      ? initialHistory.items
      : Array.isArray(initialHistory?.messages)
        ? initialHistory.messages
        : [];
    const combined = [
      ...olderMessages,
      ...baseHistory,
      ...liveEvents,
      ...pendingMessages,
    ];
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
    pendingMessages,
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
  const composerTextareaRef = useRef(null);

  useEffect(() => {
    const el = composerTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 128);
    el.style.height = `${Math.max(34, nextHeight)}px`;
  }, [draft]);

  const handleInputChange = (e) => {
    const val = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setDraft(val);
    if (val.trim()) {
      notifyTyping();
    }
  };

  const handleComposerKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent?.isComposing &&
      (typeof window === "undefined" || window.innerWidth >= 640)
    ) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const applySelectedImage = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      setImageUploadError(
        "Please select an image file (JPG, PNG, GIF, WebP, or AVIF).",
      );
      return;
    }
    if (file.size > MAX_RAW_IMAGE_BYTES) {
      setImageUploadError("Raw image must be smaller than 20 MB.");
      return;
    }
    setImageUploadError(null);
    setIsUploadingImage(true);
    try {
      const optimizedFile = await optimizeImage(
        file,
        IMAGE_PROFILES.FEED_ATTACHMENT,
      );
      setSelectedImageFile(optimizedFile);
      const dataUrl = await fileToDataUrl(optimizedFile);
      setSelectedImagePreview(dataUrl);
    } catch {
      setImageUploadError("Could not optimize selected image.");
    } finally {
      setIsUploadingImage(false);
    }
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
    if (isUploadingImage || sendCooldownLeftMs > 0) return;

    const text = draft.trim();
    const cleanUrl = attachmentUrl.trim();
    const fileToUpload = selectedImageFile;
    const previewForBubble = selectedImagePreview;
    const labelForUrl = attachmentName.trim();

    if (!text && !cleanUrl && !fileToUpload) return;

    const isImgUrl =
      Boolean(cleanUrl) &&
      (/^data:image\//i.test(cleanUrl) ||
        /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(cleanUrl));

    const optimisticAttachments = [];
    if (fileToUpload && previewForBubble) {
      optimisticAttachments.push({
        url: previewForBubble,
        name: fileToUpload.name || "chat-image.webp",
        type: "IMAGE",
        mimeType: fileToUpload.type || "image/webp",
        sizeBytes: fileToUpload.size,
        isUploading: true,
      });
    }
    if (cleanUrl) {
      optimisticAttachments.push({
        url: cleanUrl,
        name: labelForUrl || cleanUrl,
        type: isImgUrl ? "IMAGE" : "LINK",
        mimeType: isImgUrl ? "image/webp" : undefined,
        isUploading: false,
      });
    }

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const optimisticMsg = {
      eventId: tempId,
      type: optimisticAttachments.length > 0 ? "MEDIA_MESSAGE" : "TEXT_MESSAGE",
      spaceId: room.spaceId,
      senderId: currentUserId,
      sender: {
        userId: currentUserId,
        username: "You",
      },
      content: text,
      attachments: optimisticAttachments,
      reactions: {},
      timestamp: new Date().toISOString(),
      isOptimisticUploading: Boolean(fileToUpload),
    };

    // 1. Immediately show message bubble in chat thread and reset composer
    setPendingMessages((prev) => [...prev, optimisticMsg]);
    setDraft("");
    setAttachmentUrl("");
    setAttachmentName("");
    setShowAttachmentInput(false);
    handleClearImageFile();
    shouldAutoScrollRef.current = true;
    startSendCooldown();

    // 2. Upload image (if any) and dispatch message to backend
    const finalAttachments = [];

    if (fileToUpload) {
      try {
        const optimizedFile =
          fileToUpload.size <= IMAGE_PROFILES.FEED_ATTACHMENT.maxBytes &&
          fileToUpload.type === "image/webp"
            ? fileToUpload
            : await optimizeImage(fileToUpload, IMAGE_PROFILES.FEED_ATTACHMENT);

        let uploadedAttachment = null;
        try {
          uploadedAttachment = await uploadSpaceChatImage({
            spaceId: room.spaceId,
            file: optimizedFile,
          }).unwrap();
        } catch {
          // Compress to compact inline WebP (< 40 KB) so REST/STOMP payload always succeeds
          const compactFallbackFile = await optimizeImage(optimizedFile, {
            maxWidth: 960,
            maxHeight: 720,
            maxBytes: 38 * 1024,
            initialQuality: 0.72,
            minQuality: 0.32,
          });
          const dataUrl = await fileToDataUrl(compactFallbackFile);
          uploadedAttachment = {
            url: dataUrl,
            name: optimizedFile.name || "chat-image.webp",
            type: "IMAGE",
            mimeType: "image/webp",
            sizeBytes: compactFallbackFile.size,
          };
        }

        const resolvedUrl = uploadedAttachment?.url || previewForBubble;
        if (resolvedUrl) {
          finalAttachments.push({
            url: resolvedUrl,
            name:
              uploadedAttachment?.name ||
              optimizedFile.name ||
              "chat-image.webp",
            type: "IMAGE",
            mimeType:
              uploadedAttachment?.mimeType ||
              optimizedFile.type ||
              "image/webp",
            sizeBytes:
              uploadedAttachment?.sizeBytes ||
              uploadedAttachment?.size ||
              optimizedFile.size,
          });
        }
      } catch {
        if (previewForBubble) {
          finalAttachments.push({
            url: previewForBubble,
            name: fileToUpload.name || "chat-image.webp",
            type: "IMAGE",
            mimeType: "image/webp",
            sizeBytes: fileToUpload.size,
          });
        }
      }
    }

    if (cleanUrl) {
      finalAttachments.push({
        url: cleanUrl,
        name: labelForUrl || cleanUrl,
        type: isImgUrl ? "IMAGE" : "LINK",
        mimeType: isImgUrl ? "image/webp" : undefined,
      });
    }

    try {
      const resultDto = await sendStompMessage({
        content: text,
        attachments: finalAttachments,
      });

      if (resultDto?.eventId) {
        // Real message is now in liveEvents & cache; remove the temporary optimistic bubble
        setPendingMessages((prev) => prev.filter((m) => m.eventId !== tempId));
      } else {
        // Mark the optimistic bubble as finished uploading with the final attachment URLs
        setPendingMessages((prev) =>
          prev.map((m) =>
            m.eventId === tempId
              ? {
                  ...m,
                  isOptimisticUploading: false,
                  attachments: finalAttachments.map((a) => ({
                    ...a,
                    isUploading: false,
                  })),
                }
              : m,
          ),
        );
      }
    } catch {
      // Keep message in thread with uploading spinner cleared so user's image/text stays visible
      setPendingMessages((prev) =>
        prev.map((m) =>
          m.eventId === tempId
            ? {
                ...m,
                isOptimisticUploading: false,
                attachments: (finalAttachments.length
                  ? finalAttachments
                  : m.attachments
                ).map((a) => ({
                  ...a,
                  isUploading: false,
                })),
              }
            : m,
        ),
      );
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

  const onlineUserIdsSet = useMemo(() => {
    const set = new Set();
    if (currentUserId) {
      set.add(String(currentUserId));
    }
    if (Array.isArray(room.onlineUserIds)) {
      room.onlineUserIds.forEach((id) => id && set.add(String(id)));
    }
    if (Array.isArray(stompOnlineUserIds)) {
      stompOnlineUserIds.forEach((id) => id && set.add(String(id)));
    }
    if (Array.isArray(spaceRoster)) {
      spaceRoster.forEach((m) => {
        const uid = m?.userId || m?.id;
        if (!uid) return;
        const liveOverride = userPresenceMap[String(uid)];
        if (liveOverride) {
          if (liveOverride.online) set.add(String(uid));
          else set.delete(String(uid));
        } else if (m.online) {
          set.add(String(uid));
        }
      });
    }
    Object.entries(userPresenceMap).forEach(([uid, state]) => {
      if (state?.online) set.add(String(uid));
      else if (String(uid) !== String(currentUserId)) set.delete(String(uid));
    });
    return set;
  }, [
    currentUserId,
    room.onlineUserIds,
    stompOnlineUserIds,
    spaceRoster,
    userPresenceMap,
  ]);

  const { onlineMembers, offlineMembers, activeOnlineCount } = useMemo(() => {
    const list = Array.isArray(spaceRoster) ? spaceRoster : [];
    const on = [];
    const off = [];
    list.forEach((m) => {
      const uid = String(m?.userId || m?.id || "");
      if (!uid) return;
      const isUserOnline = onlineUserIdsSet.has(uid);
      const lastActive =
        userPresenceMap[uid]?.lastActiveAt || m?.lastActiveAt || m?.joinedAt;
      const enriched = {
        ...m,
        userId: uid,
        online: isUserOnline,
        lastActiveAt: lastActive,
      };
      if (isUserOnline) {
        on.push(enriched);
      } else {
        off.push(enriched);
      }
    });
    const count = Math.max(
      1,
      on.length,
      onlineUserIdsSet.size,
      Number(room.onlineCount) || 1,
    );
    return {
      onlineMembers: on,
      offlineMembers: off,
      activeOnlineCount: count,
    };
  }, [spaceRoster, onlineUserIdsSet, userPresenceMap, room.onlineCount]);

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
          <Link to={routes.spaces.detail(room.spaceId)} className="">
            <div className="relative shrink-0">
              <SpaceAvatar
                avatar={room.logoUrl}
                name={room.title}
                size="h-8 w-8"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" />
            </div>
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs sm:text-sm font-semibold text-text-heading">
                {room.title}
              </p>
              <RoleBadge role={userRole} />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="inline-flex items-center gap-1 ">
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

              <span>•</span>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex truncate items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                    title="View online space members"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <Users className="h-2.5 w-2.5" />
                    <span>{activeOnlineCount} online</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-64 p-2.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-border/70 pb-1.5">
                    <span className="text-[11px] font-semibold text-text-heading">
                      Space Presence
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {activeOnlineCount} online
                    </span>
                  </div>

                  <div className="max-h-56 space-y-1.5 overflow-y-auto pr-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Online Now ({onlineMembers.length || activeOnlineCount})
                    </p>
                    {onlineMembers.length === 0 ? (
                      <p className="py-1 text-[11px] text-text-muted">
                        You are currently active in this space.
                      </p>
                    ) : (
                      onlineMembers.map((member) => {
                        const mName =
                          member.name || member.displayName || "Space Member";
                        return (
                          <Link
                            key={member.userId}
                            to={routes.user(member.userId)}
                            className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 hover:bg-canvas transition"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="relative shrink-0">
                                <SpaceAvatar
                                  avatar={member.avatarUrl || member.avatar}
                                  name={mName}
                                  userId={member.userId}
                                  size="h-6 w-6"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-surface bg-emerald-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-text-heading">
                                  {mName}
                                  {String(member.userId) ===
                                    String(currentUserId) && (
                                    <span className="ml-1 text-[10px] text-text-muted">
                                      (You)
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                  Online now
                                </p>
                              </div>
                            </div>
                            <RoleBadge role={member.role} />
                          </Link>
                        );
                      })
                    )}

                    {offlineMembers.length > 0 && (
                      <>
                        <p className="pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                          Offline ({offlineMembers.length})
                        </p>
                        {offlineMembers.map((member) => {
                          const mName =
                            member.name || member.displayName || "Space Member";
                          return (
                            <Link
                              key={member.userId}
                              to={routes.user(member.userId)}
                              className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 opacity-75 hover:opacity-100 hover:bg-canvas transition"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="relative shrink-0">
                                  <SpaceAvatar
                                    avatar={member.avatarUrl || member.avatar}
                                    name={mName}
                                    userId={member.userId}
                                    size="h-6 w-6"
                                  />
                                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-surface bg-muted-foreground/40" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-medium text-text-heading">
                                    {mName}
                                  </p>
                                  <p className="text-[10px] text-text-muted">
                                    {formatLastActive(
                                      member.lastActiveAt,
                                      false,
                                    )}
                                  </p>
                                </div>
                              </div>
                              <RoleBadge role={member.role} />
                            </Link>
                          );
                        })}
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {roomSubtitle && (
                <>
                  <span>•</span>
                  <span className="truncate">{roomSubtitle}</span>
                </>
              )}
            </div>
          </div>
        </div>
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

        <AsyncStateBoundary
          isLoading={isHistoryLoading}
          hasData={mergedMessages.length > 0}
          error={historyError}
          errorTitle="Could not load conversation history"
          onRetry={refetchHistory}
          loadingFallback="chat-history"
          isEmpty={mergedMessages.length === 0}
          emptyFallback={
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
          }
        >
          {mergedMessages.map((message) => {
            const senderId = message.sender?.userId || message.senderId;
            const isMine =
              currentUserId && String(senderId) === String(currentUserId);
            const isSenderOnline =
              isMine ||
              (senderId && onlineUserIdsSet.has(String(senderId))) ||
              Boolean(message.sender?.online);
            const senderLastActive =
              (senderId && userPresenceMap[String(senderId)]?.lastActiveAt) ||
              message.sender?.lastActiveAt ||
              message.timestamp;
            const canDelete = isMine || isSpaceModerator;
            const reactionsMap = message.reactions || {};
            const reactionEntries = Object.entries(reactionsMap).filter(
              ([, users]) => Array.isArray(users) && users.length > 0,
            );

            return (
              <div
                key={message.eventId}
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
                      avatar={message.sender?.avatarUrl}
                      name={message.sender?.username || "Member"}
                      size="h-7 w-7"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface ${
                        isSenderOnline
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>
                )}

                <div
                  className={`flex max-w-[85%] sm:max-w-[60ch] flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Header (only shown for other members; own messages show timestamp only) */}
                  <div className="mb-0.5 flex items-center gap-1.5 px-0.5">
                    {!isMine && (
                      <>
                        <span className="text-[11px] font-semibold text-text-heading">
                          {message.sender?.username || "Space Member"}
                        </span>
                        <RoleBadge role={message.sender?.role} />
                      </>
                    )}
                    <span className="text-[10px] text-text-muted">
                      {formatChatTime(message.timestamp)}
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
                      {message.content && (
                        <FormattedMessageContent
                          content={message.content}
                          isMine={isMine}
                        />
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
                              const isAttUploading = Boolean(
                                att.isUploading ||
                                message.isOptimisticUploading,
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
                                      setLightboxImage({
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
                          className={`absolute bottom-full mb-2 z-20 grid grid-cols-6 gap-1 rounded-xl border border-border bg-surface p-2 shadow-md w-max max-w-[240px] ${
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
                              className="hover:scale-125 transition-transform text-base p-1 cursor-pointer flex items-center justify-center"
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
          })}
        </AsyncStateBoundary>
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
                      ? "Optimizing & uploading image…"
                      : `Ready to send · ${formatFileSize(selectedImageFile?.size || 0)} WebP`}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-destructive">{imageUploadError}</p>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleClearImageFile}
            disabled={isUploadingImage}
            className="rounded p-1 text-text-muted hover:text-text-heading cursor-pointer disabled:opacity-50"
            aria-label="Remove selected image"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Optional Attachment Input Drawer */}
      {showAttachmentInput && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border/70 bg-canvas/60 px-3 py-2">
          <Link2 className="h-3.5 w-3.5 text-text-muted shrink-0" />
          <Input
            type="url"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Paste attachment or image URL (https://…)"
            className="flex-1 min-w-44 h-7 rounded border border-border/70 bg-surface px-2 text-xs text-text-heading"
          />
          <Input
            type="text"
            value={attachmentName}
            onChange={(e) => setAttachmentName(e.target.value)}
            placeholder="Label (optional)"
            className="w-36 h-7 rounded border border-border/70 bg-surface px-2 text-xs text-text-heading"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              setShowAttachmentInput(false);
              setAttachmentUrl("");
              setAttachmentName("");
            }}
            className="rounded p-1 text-text-muted hover:text-text-heading cursor-pointer"
            aria-label="Close attachment input"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Message Composer */}
      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 border-t border-border/70 p-2.5 bg-surface"
      >
        <Input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageFileSelect}
          className="sr-only"
          tabIndex={-1}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploadingImage}
          title="Upload image"
          aria-label="Upload image"
          className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border transition cursor-pointer disabled:opacity-50 ${
            selectedImageFile
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 bg-canvas text-text-muted hover:text-text-heading"
          }`}
        >
          <ImagePlus size={15} />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowAttachmentInput((prev) => !prev)}
          title="Attach link or media URL"
          aria-label="Attach link or media URL"
          className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border transition cursor-pointer ${
            showAttachmentInput
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 bg-canvas text-text-muted hover:text-text-heading"
          }`}
        >
          <Plus size={15} />
        </Button>

        <div className="relative flex-1 min-w-0">
          <Textarea
            ref={composerTextareaRef}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            value={draft}
            onChange={handleInputChange}
            onKeyDown={handleComposerKeyDown}
            onPaste={handlePaste}
            placeholder={`Message ${room.title}…`}
            className="block w-full min-h-[34px] max-h-32 resize-none overflow-y-auto rounded-md border border-border/70 bg-canvas px-3 py-1.5 text-base sm:text-xs leading-relaxed text-text-heading placeholder:text-text-muted"
          />
          {draft.length >= 1500 && (
            <span
              className={`pointer-events-none absolute bottom-1 right-2 rounded bg-surface/90 px-1 text-[10px] font-medium tabular-nums ${
                draft.length >= MAX_MESSAGE_LENGTH
                  ? "text-destructive"
                  : "text-text-muted"
              }`}
            >
              {draft.length}/{MAX_MESSAGE_LENGTH}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={
            isUploadingImage ||
            sendCooldownLeftMs > 0 ||
            (!draft.trim() && !attachmentUrl.trim() && !selectedImageFile)
          }
          title={
            sendCooldownLeftMs > 0
              ? `Wait ${(sendCooldownLeftMs / 1000).toFixed(1)}s before sending next message`
              : "Send message (Enter)"
          }
          aria-label="Send message"
          className="min-h-9 min-w-9 sm:h-8 sm:w-8 shrink-0 px-1.5"
        >
          {isUploadingImage ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : sendCooldownLeftMs > 0 ? (
            <span className="text-[10px] font-semibold tabular-nums">
              {(sendCooldownLeftMs / 1000).toFixed(1)}s
            </span>
          ) : (
            <Send size={13} aria-hidden="true" />
          )}
        </Button>
      </form>

      <Dialog
        open={Boolean(lightboxImage)}
        onOpenChange={(open) => {
          if (!open) setLightboxImage(null);
        }}
      >
        <DialogContent className="max-w-3xl p-3 sm:p-4">
          <DialogHeader>
            <DialogTitle className="truncate text-xs sm:text-sm font-semibold">
              {lightboxImage?.name || "Image preview"}
            </DialogTitle>
          </DialogHeader>
          {lightboxImage?.url && (
            <div className="mt-1 flex max-h-[75dvh] items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-black/40">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.name || "Preview"}
                className="max-h-[72dvh] w-auto max-w-full object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSpaceId = searchParams.get("space");
  const currentUserId = useSelector(selectCurrentUserId);

  const {
    data: fetchedRooms,
    isLoading,
    error,
  } = useGetSpaceChatRoomsQuery(undefined, {
    refetchOnFocus: false,
  });

  const { cachedClassrooms } =
    classroomApi.endpoints.fetchClassrooms.useQueryState(undefined, {
      selectFromResult: ({ data }) => ({
        cachedClassrooms: Array.isArray(data) ? data : undefined,
      }),
    });

  const rooms = useMemo(() => {
    if (Array.isArray(fetchedRooms) && fetchedRooms.length > 0) {
      return fetchedRooms;
    }
    if (Array.isArray(cachedClassrooms) && cachedClassrooms.length > 0) {
      return cachedClassrooms.map((c) => ({
        spaceId: c.id || c.courseId,
        title: c.title || c.name || "Space",
        subtitle: c.section || c.subtitle || "",
        avatarUrl: c.logoUrl || c.logo || null,
        memberCount: c.memberCount || 0,
        onlineCount: 0,
        onlineUserIds: [],
        unreadCount: 0,
      }));
    }
    return fetchedRooms ?? [];
  }, [fetchedRooms, cachedClassrooms]);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
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
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter(
      (room) =>
        (room.title || "").toLowerCase().includes(q) ||
        (room.subtitle || "").toLowerCase().includes(q),
    );
  }, [rooms, debouncedQuery]);

  const activeRoom = useMemo(
    () => rooms.find((room) => room.spaceId === effectiveSpaceId) || null,
    [rooms, effectiveSpaceId],
  );

  if (isLoading && rooms.length === 0) {
    return <ChatLayoutSkeleton />;
  }

  if (error && rooms.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-4">
        <ErrorState
          error={error}
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
            <SearchInput
              value={query}
              onImmediateChange={setQuery}
              onChange={setDebouncedQuery}
              placeholder="Search space chats…"
              className="w-full"
            />
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
        <div className={`min-h-0 ${activeRoom ? "flex" : "hidden lg:flex"}`}>
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
