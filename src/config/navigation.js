import { IoBookOutline, IoHomeOutline, IoPeopleSharp } from 'react-icons/io5';
import { MessageCircleIcon, NotebookIcon, SaveIcon } from 'lucide-react';

export const SIDEBAR_NAV_ITEMS = [
  {
    label: 'Home',
    to: '/dashboard',
    Icon: IoHomeOutline,
  },
  {
    label: 'Community',
    to: '/dashboard/community',
    Icon: IoPeopleSharp,
  },
  {
    label: 'Messages',
    to: '/dashboard/messages',
    Icon: MessageCircleIcon,
  },
  {
    label: 'Assignments',
    to: '/dashboard/assignments',
    Icon: NotebookIcon,
  },
  {
    label: 'Saved',
    to: '/dashboard/saved',
    Icon: SaveIcon,
  },
];
