// src/config/navigation.js
import { IoBookOutline, IoHomeOutline } from 'react-icons/io5';
import { BsChat } from 'react-icons/bs';
import { GoGear } from 'react-icons/go';

export const SIDEBAR_NAV_ITEMS = [
  {
    label: 'Home',
    to: '/dashboard',
    Icon: IoHomeOutline,
  },
  {
    label: 'Classes',
    to: '/dashboard/classes',
    Icon: IoBookOutline,
  },
  {
    label: 'Chat',
    to: '/dashboard/chat',
    Icon: BsChat,
  },
  {
    label: 'Settings',
    to: '/dashboard/settings',
    Icon: GoGear,
  },
];
