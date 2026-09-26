import { useEffect, useMemo, useRef, useState } from "react";
import { History, MessageSquare } from "lucide-react";
import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import { useGetClassroomRosterQuery } from "@/features/spaces/api/classroomApi.js";
import {
  useMarkSpaceChatReadMutation,
  useUploadSpaceChatImageMutation,
} from "../api/messagesApi.js";
import { useSpaceStompChat } from "../hooks/useSpaceStompChat.js";
import { useMessageHistory } from "../hooks/useMessageHistory.js";
import { useMessagePresence } from "../hooks/useMessagePresence.js";
import { useSendCooldown } from "../hooks/useSendCooldown.js";
import { MessageThreadHeader } from "./MessageThreadHeader.jsx";
import { MessageItem } from "./MessageItem.jsx";
import { MessageInput } from "./MessageInput.jsx";
import { MessageLightbox } from "./MessageLightbox.jsx";
import {
  fileToDataUrl,
  IMAGE_PROFILES,
  MAX_RAW_IMAGE_BYTES,
  optimizeImage,
} from "@/utils/optimizeImage.js";

export function MessageThread({ room, currentUserId, onBack }) {
  const [draft, setDraft] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [activeEmojiPickerId, setActiveEmojiPickerId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const { sendCooldownLeftMs, startSendCooldown } = useSendCooldown();

  const [markSpaceChatRead] = useMarkSpaceChatReadMutation();
  const [uploadSpaceChatImage] = useUploadSpaceChatImageMutation();

  const { data: spaceRoster = [] } = useGetClassroomRosterQuery(room?.spaceId, {
    skip: !room?.spaceId,
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
  } = useSpaceStompChat(room?.spaceId);

  const {
    initialHistory,
    mergedMessages,
    setPendingMessages,
    isHistoryLoading,
    historyError,
    refetchHistory,
    hasOlderMore,
    isFetchingOlder,
    handleLoadOlder,
    handleDeleteMessage,
  } = useMessageHistory({
    spaceId: room?.spaceId,
    liveEvents,
    reactionPatches,
    deletedEventIds,
  });

  const {
    onlineUserIdsSet,
    onlineMembers,
    offlineMembers,
    activeOnlineCount,
  } = useMessagePresence({
    currentUserId,
    room,
    spaceRoster,
    stompOnlineUserIds,
    userPresenceMap,
  });

  // Mark chat read only when unread messages exist on room open or when a live message from another user arrives (debounced)
  const lastLiveEvent = liveEvents[liveEvents.length - 1] || null;
  const lastLiveSenderId =
    lastLiveEvent?.sender?.userId || lastLiveEvent?.senderId || null;

  useEffect(() => {
    if (!room?.spaceId) return undefined;
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
    room?.spaceId,
    room?.unreadCount,
    lastLiveEvent?.eventId,
    lastLiveSenderId,
    currentUserId,
    markSpaceChatRead,
  ]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    shouldAutoScrollRef.current = true;
  }, [mergedMessages.length]);

  const userRole = (room?.myRole || room?.userRole || "").toUpperCase();
  const isSpaceModerator = userRole === "OWNER" || userRole === "ADMIN";

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

    setPendingMessages((prev) => [...prev, optimisticMsg]);
    setDraft("");
    setAttachmentUrl("");
    setAttachmentName("");
    setShowAttachmentInput(false);
    handleClearImageFile();
    shouldAutoScrollRef.current = true;
    startSendCooldown();

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
        setPendingMessages((prev) => prev.filter((m) => m.eventId !== tempId));
      } else {
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
      <MessageThreadHeader
        room={room}
        userRole={userRole}
        isConnected={isConnected}
        onlineMembers={onlineMembers}
        offlineMembers={offlineMembers}
        activeOnlineCount={activeOnlineCount}
        currentUserId={currentUserId}
        onBack={onBack}
      />

      {/* Messages Stream */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4 bg-canvas/30">
        {!isSpaceModerator &&
          (initialHistory?.joinedAt || room?.joinedAt) &&
          !hasOlderMore && (
            <div className="flex justify-center pb-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/90 px-3 py-1 text-[11px] text-text-muted shadow-2xs">
                <History className="h-3 w-3 text-primary shrink-0" />
                <span>
                  You joined on{" "}
                  {new Date(
                    initialHistory?.joinedAt || room?.joinedAt,
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

        {hasOlderMore && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={() => {
                shouldAutoScrollRef.current = false;
                handleLoadOlder();
              }}
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
                  Welcome to {room?.title} Chat
                </p>
                <p className="text-[11px] text-text-muted">
                  Start a live discussion with everyone enrolled in this space.
                </p>
              </div>
            </div>
          }
        >
          {mergedMessages.map((message) => (
            <MessageItem
              key={message.eventId}
              message={message}
              currentUserId={currentUserId}
              isSpaceModerator={isSpaceModerator}
              onlineUserIdsSet={onlineUserIdsSet}
              userPresenceMap={userPresenceMap}
              activeEmojiPickerId={activeEmojiPickerId}
              setActiveEmojiPickerId={setActiveEmojiPickerId}
              onDeleteMessage={handleDeleteMessage}
              onToggleReaction={toggleReaction}
              onOpenLightbox={setLightboxImage}
            />
          ))}
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

      {/* Message Composer */}
      <MessageInput
        draft={draft}
        onDraftChange={setDraft}
        roomTitle={room?.title}
        selectedImageFile={selectedImageFile}
        selectedImagePreview={selectedImagePreview}
        imageUploadError={imageUploadError}
        isUploadingImage={isUploadingImage}
        showAttachmentInput={showAttachmentInput}
        setShowAttachmentInput={setShowAttachmentInput}
        attachmentUrl={attachmentUrl}
        onAttachmentUrlChange={setAttachmentUrl}
        attachmentName={attachmentName}
        onAttachmentNameChange={setAttachmentName}
        sendCooldownLeftMs={sendCooldownLeftMs}
        onSend={handleSend}
        onImageFileSelect={handleImageFileSelect}
        onClearImageFile={handleClearImageFile}
        onPaste={handlePaste}
        notifyTyping={notifyTyping}
      />

      {/* Image Lightbox */}
      <MessageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
