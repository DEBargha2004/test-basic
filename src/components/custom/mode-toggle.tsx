"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ModeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      size={"icon"}
      className={cn("rounded-full shadow-inner", className)}
      suppressHydrationWarning
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted ? (
        <>
          <Sun
            className={cn(
              "",
              (theme === "dark" || theme === "system") && "hidden"
            )}
          />
          <Moon className={cn("", theme === "light" && "hidden")} />
        </>
      ) : null}
    </Button>
  );
}
