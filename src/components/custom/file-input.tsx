import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function FileInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      className={cn(
        "file:border-input file:text-foreground/70 italic file:not-italic file:bg-transparent file:h-full",
        "file:border-e p-0 pe-3 file:me-3 file:px-3 file:text-sm file:font-medium",
        className
      )}
      type="file"
      {...props}
    />
  );
}
