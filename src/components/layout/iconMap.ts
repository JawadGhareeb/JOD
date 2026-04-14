import {
  Bell,
  Bookmark,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Monitor,
  Newspaper,
  Plus,
  Send,
  Sun,
  UserRound,
  X,
  Moon,
  type LucideIcon,
} from "lucide-react-native";

export const appIcons = {
  notification: Bell,
  menu: Menu,
  close: X,
  home: Home,
  profile: UserRound,
  blogs: Newspaper,
  createPost: Plus,
  myDonations: Heart,
  savedPosts: Bookmark,
  comments: MessageCircle,
  shares: Send,
  logout: LogOut,
  lightMode: Sun,
  darkMode: Moon,
  systemMode: Monitor,
} satisfies Record<string, LucideIcon>;

export type AppIconKey = keyof typeof appIcons;
