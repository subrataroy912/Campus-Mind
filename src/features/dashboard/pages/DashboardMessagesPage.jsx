import { useMemo, useState } from "react";
import { ArrowLeft, Search, Send } from "lucide-react";

import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { useMessages } from "../hooks/useMessages.js";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
// import { useAuth } from "@/context/AuthContext.jsx";

const EMPTY_CONVERSATIONS = [];

function ConversationListItem({ conversation, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        active ? "bg-canvas" : "hover:bg-canvas"
      }`}
    >
      <ClassroomAvatar name={conversation.name} size="h-10 w-10" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-text-heading">
            {conversation.name}
          </span>
          <span className="shrink-0 text-xs text-text-muted">
            {conversation.time}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-text-muted">
          {conversation.classroom}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-sm text-text-muted">
            {conversation.lastMessage}
          </span>
          {conversation.unread > 0 && (
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
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
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-lg p-1.5 text-text-main hover:bg-canvas lg:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={18} />
        </button>
        <ClassroomAvatar name={conversation.name} size="h-9 w-9" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-heading">
            {conversation.name}
          </p>
          <p className="truncate text-xs text-text-muted">
            {conversation.classroom}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-6 ${
                message.from === "me"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-canvas text-text-heading"
              }`}
            >
              {message.text}
              <span
                className={`mt-1 block text-[10px] ${
                  message.from === "me"
                    ? "text-primary-foreground/70"
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
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message…"
          className="flex-1 rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-text-heading outline-none placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-focus"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim()}
          aria-label="Send message"
        >
          <Send size={16} aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}

export default function DashboardMessagesPage() {
  // const {user} = useAuth();
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
      <div className="grid min-h-64 place-items-center text-sm text-text-muted">
        Loading messages…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        <EmptyState
          title="We could not load messages"
          description="Please try again later."
        />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        <header>
          <p className="text-sm font-semibold text-primary">Messages</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
            Your conversations.
          </h1>
          <p className="mt-2 text-text-muted">
            Messages are kept with the classes they belong to, so it is easier
            to find the context later.
          </p>
        </header>
        <div className="mt-8">
          <EmptyState
            title="No messages to catch up on"
            description="Open a class to join its conversation."
            action={{ to: "/dashboard", label: "View my classes" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-6xl flex-col p-1 sm:p-1">
      <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border lg:grid-cols-[320px_1fr]">
        <div
          className={`flex min-h-0 flex-col border-border lg:border-r ${
            activeConversation ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-border p-3">
            <header className="shrink-0">
              <p className="text-sm font-semibold text-primary">Messages</p>
              {/* <h1 className="mt-1 text-xl font-semibold tracking-tight text-text-heading">
                Your conversations.
              </h1> */}
            </header>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations…"
                className="w-full rounded-lg border border-border bg-canvas py-2 pl-9 pr-3 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
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
            <div className="grid flex-1 place-items-center px-6 text-center text-sm text-text-muted">
              Select a conversation to start reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
