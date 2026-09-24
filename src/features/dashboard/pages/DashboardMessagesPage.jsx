import { useMemo, useState } from "react";
import { ArrowLeft, Search, Send } from "lucide-react";

import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { useMessages } from "../hooks/useMessages.js";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { routes } from "@/routes/paths.js";

const EMPTY_CONVERSATIONS = [];

function ConversationListItem({ conversation, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition cursor-pointer ${
        active
          ? "bg-primary/10 text-primary"
          : "hover:bg-canvas/70 text-text-main"
      }`}
    >
      <ClassroomAvatar
        avatar={conversation.avatar}
        name={conversation.name}
        size="h-7 w-7"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-1.5">
          <span
            className={`truncate text-xs font-medium ${active ? "text-primary font-semibold" : "text-text-heading"}`}
          >
            {conversation.name}
          </span>
          <span className="shrink-0 text-[10px] text-text-muted">
            {conversation.time}
          </span>
        </span>
        <span className="block truncate text-[11px] text-text-muted">
          {conversation.classroom}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-1.5">
          <span className="truncate text-xs text-text-muted">
            {conversation.lastMessage}
          </span>
          {conversation.unread > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {conversation.unread}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

function ChatThread({ conversation, onBack }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(conversation.messages);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((previous) => [
      ...previous,
      { id: previous.length + 1, from: "me", text, time: "Now" },
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-border/70 px-3 py-2 bg-surface">
        <button
          onClick={onBack}
          className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 inline-flex items-center justify-center rounded-md p-1 text-text-main hover:bg-canvas lg:hidden cursor-pointer"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={18} />
        </button>
        <ClassroomAvatar
          avatar={conversation.avatar}
          name={conversation.name}
          size="h-7 w-7"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-text-heading">
            {conversation.name}
          </p>
          <p className="truncate text-[11px] text-text-muted">
            {conversation.classroom}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3 bg-canvas/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-lg px-3 py-1.5 text-xs leading-relaxed ${
                message.from === "me"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border/70 text-text-heading"
              }`}
            >
              {message.text}
              <span
                className={`mt-0.5 block text-[10px] ${
                  message.from === "me"
                    ? "text-primary-foreground/75 text-right"
                    : "text-text-muted"
                }`}
              >
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 border-t border-border/70 p-2 bg-surface"
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message…"
          className="flex-1 h-9 sm:h-8 rounded-md border border-border/70 bg-canvas px-3 text-base sm:text-xs text-text-heading outline-none placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-focus"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim()}
          aria-label="Send message"
          className="min-h-9 min-w-9 sm:h-8 sm:w-8"
        >
          <Send size={13} aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}

export default function DashboardMessagesPage() {
  const { data, isLoading, error } = useMessages();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);
  const conversations = data?.conversations ?? EMPTY_CONVERSATIONS;

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(q) ||
        conversation.classroom.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId,
  );

  if (isLoading) {
    return (
      <div className="grid min-h-64 place-items-center text-xs text-text-muted">
        Loading messages…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-4">
        <EmptyState
          title="We could not load messages"
          description="Please try again later."
        />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
        <header className="mb-4">
          <h1 className="text-base font-semibold tracking-tight text-text-heading">
            Your conversations
          </h1>
          <p className="text-xs text-text-muted">
            Messages are kept with the classes they belong to, so it is easier
            to find the context later.
          </p>
        </header>
        <div>
          <EmptyState
            title="No messages to catch up on"
            description="Open a class to join its conversation."
            action={{ to: routes.classes.list, label: "View my classes" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-7xl flex-col p-2 sm:p-3">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-lg border border-border/80 bg-surface shadow-xs lg:grid-cols-[280px_1fr]">
        <div
          className={`flex min-h-0 flex-col border-border/70 lg:border-r ${
            activeConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-border/70 p-2.5">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations…"
                className="h-8 w-full rounded-md border border-border/70 bg-canvas py-1.5 pl-8 pr-2.5 text-base sm:text-xs text-text-heading outline-none focus:border-primary focus:ring-1 focus:ring-focus placeholder:text-text-muted"
              />
            </div>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto p-1.5">
            {filteredConversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === activeId}
                onSelect={setActiveId}
              />
            ))}
          </div>
        </div>

        <div
          className={`min-h-0 ${activeConversation ? "flex" : "hidden lg:flex"}`}
        >
          {activeConversation ? (
            <ChatThread
              conversation={activeConversation}
              onBack={() => setActiveId(null)}
            />
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center text-xs text-text-muted">
              Select a conversation to start reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
