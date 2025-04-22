import { cn } from "@/lib/utils";
import { Bungee_Spice } from "next/font/google";
import Link from "next/link";
import React from "react";

const bungeeSpice = Bungee_Spice({
  weight: "400",
});

export default function AppLogo({
  className,
  style,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <Link href={"/"} className="block">
      <h1
        className={cn("font-semibold text-xl", className)}
        style={{ fontFamily: bungeeSpice.style.fontFamily }}
        {...props}
      >
        Quizify
      </h1>
    </Link>
  );
}
