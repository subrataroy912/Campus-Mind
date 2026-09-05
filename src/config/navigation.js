import { BookOpen, Home, MessageCircle, Save, Users } from "lucide-react";

export const SIDEBAR_NAV_ITEMS = [
  { label: "Home", to: "/dashboard", Icon: Home },
  { label: "Community", to: "/dashboard/community", Icon: Users },
  { label: "Messages", to: "/dashboard/messages", Icon: MessageCircle },
  { label: "Assignments", to: "/dashboard/assignments", Icon: BookOpen },
  { label: "Saved", to: "/dashboard/saved", Icon: Save },
];
