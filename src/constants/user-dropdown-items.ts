import { TIcon } from "@/types/icon";
import { Layout, NotebookPen, PenSquare, UserRound } from "lucide-react";

type DropdownMenuItem = {
  id: string;
  label: string;
  href: string;
  icon: TIcon;
};

export const userDropdownItemsFirst: DropdownMenuItem[] = [
  {
    id: "tests",
    label: "Tests",
    href: "/dashboard/tests",
    icon: NotebookPen,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Layout,
  },
];

export const userDropdownItemsSecond: DropdownMenuItem[] = [
  {
    id: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    id: "attempts",
    label: "Attempts",
    href: "/dashboard/attempts",
    icon: PenSquare,
  },
];
