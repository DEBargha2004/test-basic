import { TSidebarItem } from "@/types/sidebar-item";
import { Home, Layout, NotebookPen, PenSquare, Star } from "lucide-react";
import micromatch from "micromatch";

export const appSidebarItems: TSidebarItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: Home,
    pattern: "/",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
  {
    id: "your-tests",
    label: "Your Tests",
    href: "/dashboard/tests",
    icon: NotebookPen,
    pattern: "/dashboard/tests",
    target: "_blank",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
  {
    id: "your-attempts",
    label: "Your Attempts",
    href: "/dashboard/your-attempts",
    icon: PenSquare,
    pattern: "/dashboard/your-attempts",
    target: "_blank",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
  {
    id: "wishlist",
    label: "Wishlist",
    href: "/dashboard/wishlist",
    icon: Star,
    pattern: "/dashboard/wishlist",
    target: "_blank",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    pattern: "/dashboard",
    icon: Layout,
    target: "_blank",
    isActive(pathname) {
      return micromatch.isMatch(pathname, this.pattern!);
    },
  },
];
