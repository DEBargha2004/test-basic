"use client";

import { cn, getAcronym } from "@/lib/utils";
import AppLogo from "@/components/custom/app-logo";
import Searchbar from "@/components/custom/navbar/searchbar";
import { useSession } from "@/lib/auth-client";
import UserDropdownMenu from "@/components/custom/navbar/user-dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/url";
import Favourites from "./favourites";
import { StarIcon } from "lucide-react";
import MyCreations from "./my-creations";
import ModeToggle from "../mode-toggle";

export default function Navbar() {
  const { data } = useSession();

  return (
    <nav
      className={cn(
        "p-3 sticky border-b top-0",
        "flex justify-start items-center gap-4 bg-background z-50"
      )}
    >
      <AppLogo />
      {!data?.user && (
        <Link href={"/auth/sign-in"} className="ml-auto">
          <Button>Sign In</Button>
        </Link>
      )}

      {!data?.user && (
        <Link href={"/auth/sign-up"}>
          <Button variant={"secondary"}>Sign Up</Button>
        </Link>
      )}

      {data?.user && (
        <MyCreations>
          <Button variant={"ghost"} className="ml-auto h-10 cursor-pointer">
            My Creations
          </Button>
        </MyCreations>
      )}
      {data?.user && (
        <Favourites>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="cursor-pointer size-10"
          >
            <StarIcon />
          </Button>
        </Favourites>
      )}
      <ModeToggle className="size-10" />
      {data?.user && (
        <UserDropdownMenu>
          <Avatar className="size-10">
            <AvatarImage src={getImageUrl(data?.user?.image ?? "")} />
            <AvatarFallback>
              {getAcronym(data?.user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </UserDropdownMenu>
      )}
    </nav>
  );
}
