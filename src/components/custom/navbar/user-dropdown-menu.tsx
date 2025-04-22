import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import {
  userDropdownItemsFirst,
  userDropdownItemsSecond,
} from "@/constants/user-dropdown-items";

export default function UserDropdownMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const { data } = useSession();
  const handleLogout = () => {
    signOut(
      {},
      {
        onSuccess() {
          push("/");
          toast("Signed out successfully");
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userDropdownItemsFirst.map((item) => (
          <Link key={item.id} href={item.href}>
            <DropdownMenuItem>
              <item.icon />
              <span>{item.label}</span>
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        {userDropdownItemsSecond.map((item) => (
          <Link key={item.id} href={item.href}>
            <DropdownMenuItem>
              <item.icon />
              <span>{item.label}</span>
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
