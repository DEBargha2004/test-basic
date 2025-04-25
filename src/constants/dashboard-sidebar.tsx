import { TIcon } from "@/types/icon";
import { TBasicListItem, TSidebarItem } from "@/types/sidebar-item";
import {
  Layout,
  NotebookPen,
  PenSquare,
  Star,
  UserPen,
  UserRound,
  UsersRound,
} from "lucide-react";
import micromatch from "micromatch";

export const dashboardSidebarItems: TSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    pattern: "/dashboard",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
    icon: Layout,
  },
  {
    id: "tests",
    label: "Tests",
    href: "/dashboard/tests",
    pattern: "/dashboard/tests/**",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
    icon: NotebookPen,
  },
  {
    id: "users",
    label: "Users",
    href: "/dashboard/users",
    pattern: "/dashboard/users",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
    icon: UsersRound,
  },
  {
    id: "attempts",
    label: "Attempts",
    href: "/dashboard/attempts",
    pattern: "/dashboard/attempts",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
    icon: UserPen,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    href: "/dashboard/wishlist",
    icon: Star,
    pattern: "/dashboard/wishlist",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
  {
    id: "your-attempts",
    label: "Your Attempts",
    href: "/dashboard/your-attempts",
    pattern: "/dashboard/your-attempts",
    icon: PenSquare,
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
  {
    id: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    pattern: "/dashboard/profile",
    icon: UserRound,
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
];

export const testFilterOptions = [
  {
    id: "latest",
    label: "Latest",
  },
  {
    id: "popular",
    label: "Popular",
  },
  {
    id: "oldest",
    label: "Oldest",
  },
] as const satisfies TBasicListItem[];
