import {
  Bell,
  Bookmark,
  Heart,
  Home,
  LogOut,
  Menu,
  Newspaper,
  Plus,
  UserRound,
  X,
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
} satisfies Record<string, LucideIcon>;

export type AppIconKey = keyof typeof appIcons;
