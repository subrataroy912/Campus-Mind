import { Flame, Sparkles, School } from "lucide-react";

export const FEED_TABS = [
  {
    id: "for-you",
    label: "For You",
    icon: Sparkles,
    tagline: "Tailored to your campus interests",
  },
  {
    id: "spaces",
    label: "My Spaces",
    icon: School,
    tagline: "Updates from classes and clubs you joined",
  },
  {
    id: "trending",
    label: "Campus Buzz",
    icon: Flame,
    tagline: "Trending polls and hottest campus topics",
    badge: "Hot",
  },
];

export const CONTENT_FILTERS = [
  { id: "all", label: "All Posts" },
  { id: "question", label: "Questions" },
  { id: "discussion", label: "Discussions" },
  { id: "poll", label: "Polls" },
  { id: "announcement", label: "Announcements" },
];
