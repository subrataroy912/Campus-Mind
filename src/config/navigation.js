import { routes } from "@/routes/paths";
import {
  Compass,
  Home,
  MessageCircle,
  Save,
  Users,
  LayoutGrid,
} from "lucide-react";

export const SIDEBAR_NAV_ITEMS = [
  { label: "Dashboard", to: routes.dashboard, Icon: Home, end: true },
  { label: "My Spaces", to: routes.spaces.list, Icon: LayoutGrid, end: true },
  { label: "Explore", to: routes.explore, Icon: Compass },
  { label: "Community", to: routes.community, Icon: Users },
  { label: "Messages", to: routes.messages, Icon: MessageCircle },
  { label: "Saved", to: routes.saved, Icon: Save },
];
