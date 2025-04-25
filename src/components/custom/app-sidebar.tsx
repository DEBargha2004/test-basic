"use client";

import { appSidebarItems } from "@/constants/app-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    signOut({
      fetchOptions: {
        onSuccess(context) {
          router.push("/");
        },
      },
    });
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup className="gap-1 list-none">
          {appSidebarItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive(pathname)}
                tooltip={item.label}
              >
                <Link href={item.href} target={item.target}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
        <SidebarSeparator className="m-0" />
        <SidebarGroup className="gap-1 list-none">
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href={"/dashboard/profile"}>
                <UserRound />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <div onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
