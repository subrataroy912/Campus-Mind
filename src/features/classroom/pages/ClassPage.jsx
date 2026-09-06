import { useState } from "react";
import { useParams } from "react-router";
import ClassFeedPost from "../components/ClassFeedPost.jsx";
import ClassHeader from "../components/ClassHeader.jsx";
import ClassPostBox from "../components/ClassPostBox.jsx";
import ClassSidePanel from "../components/ClassSidePanel.jsx";
import ClassTabs from "../components/ClassTabs.jsx";
import {
  CLASS_TABS,
  FEED_POSTS,
  PINNED_ANNOUNCEMENT,
} from "../data/classPageData.js";
import { useClassroom } from "../hooks/useClassroom.js";

export default function ClassPage() {
  const [activeTab, setActiveTab] = useState("home");
  const { classId } = useParams();
  const { classroom, error } = useClassroom(classId);

  if (classroom === undefined) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-text-muted">Loading class…</div>;
  }

  if (error) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-text-muted">Unable to load this class.</div>;
  }

  if (!classroom) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-text-muted">Class not found.</div>;
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ClassHeader classroom={classroom} />
        <ClassTabs active={activeTab} onChange={setActiveTab} />
        {activeTab === "home" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <ClassFeedPost post={PINNED_ANNOUNCEMENT} pinned />
              <ClassPostBox />
              {FEED_POSTS.map((post) => (
                <ClassFeedPost key={post.id} post={post} />
              ))}
            </div>
            <ClassSidePanel />
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center rounded-2xl bg-surface py-20 text-sm text-text-muted shadow-sm ring-1 ring-border">
            {CLASS_TABS.find((tab) => tab.id === activeTab)?.label} view coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
