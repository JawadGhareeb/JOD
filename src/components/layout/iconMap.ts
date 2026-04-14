import {
  Bell,
  Bookmark,
  Heart,
  Home,
  LogOut,
  Menu,
  Monitor,
  Newspaper,
  Plus,
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
  logout: LogOut,
  lightMode: Sun,
  darkMode: Moon,
  systemMode: Monitor,
} satisfies Record<string, LucideIcon>;

export type AppIconKey = keyof typeof appIcons;
