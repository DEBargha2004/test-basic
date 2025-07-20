"use client";

import { cn, getAcronym } from "@/lib/utils";
import AppLogo from "../app-logo";
import UserDropdownMenu from "../navbar/user-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";
import { getImageUrl } from "@/lib/url";
import ModeToggle from "../mode-toggle";

export default function DashbaordNavbar() {
  const { data } = useSession();
  return (
    <nav
      className={cn(
        "p-3 sticky top-0",
        "flex justify-start items-center gap-4 border-b bg-background z-50"
      )}
    >
      <AppLogo />
      <ModeToggle className="ml-auto size-10" />
      <UserDropdownMenu>
        <Avatar className="size-10">
          <AvatarImage src={getImageUrl(data?.user?.image ?? "")} />
          <AvatarFallback>{getAcronym(data?.user.name ?? "")}</AvatarFallback>
        </Avatar>
      </UserDropdownMenu>
    </nav>
  );
}
