import {
  BarChart3,
  Check,
  Clock3,
  Copy,
  FileText,
  Image,
  Link as LinkIcon,
  MessageCircle,
  Pin,
  Settings,
  ThumbsUp,
  Video,
} from "lucide-react";

const ICONS = {
  file: FileText,
  video: Video,
  link: LinkIcon,
  copy: Copy,
  settings: Settings,
  like: ThumbsUp,
  comment: MessageCircle,
  image: Image,
  poll: BarChart3,
  check: Check,
  clock: Clock3,
  pin: Pin,
};

export function ClassroomIcon({ name, className = "h-4 w-4" }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
