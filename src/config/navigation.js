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
  { label: "Dashboard", to: routes.dashboard, Icon: Home },
  { label: "Community", to: routes.community, Icon: Users },
  { label: "Messages", to: routes.messages, Icon: MessageCircle },
  { label: "Saved", to: routes.saved, Icon: Save },
  { label: "Explore", to: routes.explore, Icon: Compass },
  { label: "Spaces", to: routes.spaces.list, Icon: LayoutGrid },
];
