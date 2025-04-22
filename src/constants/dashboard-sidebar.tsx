import { TIcon } from "@/types/icon";
import { Layout, NotebookPen, PenSquare, UsersRound } from "lucide-react";
import micromatch from "micromatch";

type TSidebarItem = TBasicListItem & {
  href: string;
  pattern?: string;
  isActive: (pathname: string) => boolean;
  icon: TIcon;
};

export type TBasicListItem = {
  id: string;
  label: string;
};

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
    icon: PenSquare,
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
