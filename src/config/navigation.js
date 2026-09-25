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
  { label: "Home", to: routes.dashboard, Icon: Home },
  { label: "Explore", to: routes.explore, Icon: Compass },
  { label: "My Spaces", to: routes.spaces.list, Icon: LayoutGrid },
  { label: "Messages", to: routes.messages, Icon: MessageCircle },
  { label: "Saved", to: routes.saved, Icon: Save },
  { label: "Community", to: routes.community, Icon: Users },
];
