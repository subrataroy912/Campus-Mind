import { useState } from "react";
import { useParams } from "react-router";
import Classes from "../../utils/data"
// ---- Mock data -------------------------------------------------------

const TABS = [
  { id: "home", label: "Home" },
  { id: "classwork", label: "Classwork" },
  { id: "members", label: "Members" },
  { id: "grades", label: "Grades" },
];

const PINNED_ANNOUNCEMENT = {
  author: "Ms. Patel",
  time: "Pinned · Aug 25",
  content:
    "Welcome to Algebra II! Check the syllabus link in Quick links, and don't forget quizzes are every Friday.",
};

const FEED_POSTS = [
  {
    id: 1,
    author: "Ms. Patel",
    time: "2 hours ago",
    content: "Reminder: Quiz 1 covers chapters 1–3. Practice set is under Classwork.",
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    author: "Daniel R.",
    time: "5 hours ago",
    content: "Can someone explain problem 14 from last night's homework? I keep getting a negative answer.",
    likes: 3,
    comments: 6,
  },
  {
    id: 3,
    author: "Ms. Patel",
    time: "Yesterday",
    content: "Great questions in class today on factoring — here's a short video recap for anyone who wants a refresher.",
    likes: 20,
    comments: 2,
  },
];

const TODO_ITEMS = [
  { id: 1, title: "Quiz 1: Chapters 1–3", due: "Due tomorrow" },
  { id: 2, title: "Homework set 4", due: "Due in 3 days" },
  { id: 3, title: "Group project proposal", due: "Due in 6 days" },
];

const ACTIVE_NOW = [
  { id: 1, name: "Daniel R.", initials: "DR" },
  { id: 2, name: "Priya S.", initials: "PS" },
  { id: 3, name: "Wei L.", initials: "WL" },
];

const QUICK_LINKS = [
  { id: 1, label: "Syllabus", icon: "file" },
  { id: 2, label: "Zoom meeting link", icon: "video" },
  { id: 3, label: "Textbook resources", icon: "link" },
];

// ---- Small shared bits -------------------------------------------------

function Avatar({ name, size = "h-9 w-9" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-medium text-text-main`}
    >
      {initials}
    </div>
  );
}

function Icon({ name, className = "h-4 w-4" }) {
  const paths = {
    file: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12h-9m9-3.75h-9M8.25 21h7.5A2.25 2.25 0 0018 18.75V7.5L14.25 3.75H6a2.25 2.25 0 00-2.25 2.25v12.75A2.25 2.25 0 006 21z",
    video: "M15.75 10.5l4.72-2.36a.75.75 0 011.03.671v10.378a.75.75 0 01-1.03.671L15.75 18M4.5 6.75h9a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5z",
    link: "M13.5 10.5l5.25-5.25m0 0h-4.5m4.5 0v4.5M10.5 13.5L5.25 18.75m0 0h4.5m-4.5 0v-4.5",
    copy: "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9H8.625c-.621 0-1.125.504-1.125 1.125v1.5",
    settings:
      "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.397-1.11-.94l-.213-1.28c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z",
    like: "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5H5.904m.729 0v9.75m-1.5-9.75l-.75.75",
    comment:
      "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
    image: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18M3 4.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h18a1.5 1.5 0 001.5-1.5v-12a1.5 1.5 0 00-1.5-1.5",
    poll: "M3 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    check: "M4.5 12.75l6 6 9-13.5",
    clock: "M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

// ---- Header ---------------------------------------------------------

function ClassHeader({ currentClass }) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentClass?.inviteCode).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
      {/* Cover banner */}
      <div className={`relative h-28 sm:h-36 ${currentClass.theme}`}>
        <div className="absolute right-3 top-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Class settings"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/15 text-surface transition hover:bg-surface/25"
            >
              <Icon name="settings" className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-10 w-52 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border">
                {["Edit class details", "Change theme", "Notification preferences"].map(
                  (label) => (
                    <button
                      key={label}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3.5 py-2 text-left text-sm text-text-main hover:bg-canvas"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Identity + invite */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-semibold text-text-heading sm:text-2xl">
            {currentClass?.title}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {currentClass?.section || currentClass?.subtitle} · {currentClass?.teacher?.name}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 self-start rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-main transition hover:bg-canvas sm:self-auto"
        >
          <Icon name={copied ? "check" : "copy"} className={`h-4 w-4 ${copied ? "text-success" : ""}`} />
          {copied ? "Copied" : `Invite code: ${currentClass?.inviteCode}`}
        </button>
      </div>
    </div>
  );
}

// ---- Tabs -----------------------------------------------------------

function TabNav({ active, onChange }) {
  return (
    <div className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 shadow-sm ring-1 ring-border sm:gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${active === tab.id
            ? "bg-primary text-surface"
            : "text-text-main hover:bg-canvas"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ---- Post creation box ------------------------------------------------

function PostBox() {
  const [text, setText] = useState("");

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
      <div className="flex gap-3">
        <Avatar name="You" />
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share an announcement or ask a question…"
          className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
        />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-1">
          <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted hover:bg-canvas sm:text-sm">
            <Icon name="image" className="h-4 w-4" /> Attach
          </button>
          <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted hover:bg-canvas sm:text-sm">
            <Icon name="video" className="h-4 w-4" /> Video
          </button>
          <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted hover:bg-canvas sm:text-sm">
            <Icon name="poll" className="h-4 w-4" /> Poll
          </button>
        </div>
        <button
          disabled={!text.trim()}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-surface transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}

// ---- Feed post --------------------------------------------------------

function FeedPost({ post, pinned = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div
      className={`rounded-2xl bg-surface p-4 shadow-sm ring-1 sm:p-5 ${pinned ? "ring-border" : "ring-border"
        }`}
    >
      {pinned && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-secondary">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 3l5 5-5.5 5.5L17 16l-5 5-2-5-5-2 5-2.5L8.5 8 13 3l3 3z" />
          </svg>
          Pinned announcement
        </div>
      )}
      <div className="flex gap-3">
        <Avatar name={post.author} />
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
                className={`flex items-center gap-1.5 transition hover:text-primary ${liked ? "text-primary" : ""
                  }`}
              >
                <Icon name="like" className="h-4 w-4" />
                {likeCount}
              </button>
              <button className="flex items-center gap-1.5 transition hover:text-primary">
                <Icon name="comment" className="h-4 w-4" />
                {post.comments}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Side panel --------------------------------------------------------

function SidePanel() {
  return (
    <div className="space-y-4">
      {/* To-do list */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
        <h3 className="mb-3 text-sm font-semibold text-text-heading">
          Upcoming (next 7 days)
        </h3>
        <ul className="space-y-2.5">
          {TODO_ITEMS.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <div className="min-w-0">
                <p className="truncate text-sm text-text-main">{item.title}</p>
                <p className="text-xs text-text-muted">{item.due}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Active now */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-text-heading">
          <span className="h-2 w-2 rounded-full bg-success" />
          Active now
        </h3>
        <ul className="space-y-2.5">
          {ACTIVE_NOW.map((person) => (
            <li key={person.id} className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar name={person.name} size="h-7 w-7" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
              </div>
              <span className="text-sm text-text-main">{person.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick links */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
        <h3 className="mb-3 text-sm font-semibold text-text-heading">Quick links</h3>
        <ul className="space-y-1">
          {QUICK_LINKS.map((link) => (
            <li key={link.id}>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-text-main transition hover:bg-canvas">
                <Icon name={link.icon} className="h-4 w-4 text-text-muted" />
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---- Page ---------------------------------------------------------------

export default function ClassPage() {
  const [activeTab, setActiveTab] = useState("home");
  const { classId } = useParams();
  const currentClass = Classes.find((item) => item.id === String(classId));

  if (!currentClass) {
    return <div>Class not found!</div>;
  }
  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <ClassHeader currentClass={currentClass} />

        {/* Tabs */}
        <TabNav active={activeTab} onChange={setActiveTab} />

        {/* Content */}
        {activeTab === "home" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
            {/* Main column */}
            <div className="space-y-4">
              <FeedPost post={PINNED_ANNOUNCEMENT} pinned />
              <PostBox />
              {FEED_POSTS.map((post) => (
                <FeedPost key={post.id} post={post} />
              ))}
            </div>

            {/* Side panel */}
            <div>
              <SidePanel />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center rounded-2xl bg-surface py-20 text-sm text-text-muted shadow-sm ring-1 ring-border">
            {TABS.find((t) => t.id === activeTab)?.label} view coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
