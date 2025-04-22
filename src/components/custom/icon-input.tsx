import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

export default function IconInput({
  className,
  StartIcon,
  EndIcon,
  ...props
}: React.ComponentProps<"input"> & {
  StartIcon?: React.ReactNode;
  EndIcon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative h-fit",
        "[&>button]:absolute [&>button]:top-1/2 [&>button]:-translate-y-1/2 [&>button]:p-0",
        StartIcon && "[&>button]:left-2",
        EndIcon && "[&>button]:right-2",
        className
      )}
    >
      <Input
        className={cn(className, StartIcon && "pl-10", EndIcon && "pr-10")}
        {...props}
      />
      {StartIcon && (
        <Button variant={"ghost"} type="button">
          {StartIcon}
        </Button>
      )}
      {EndIcon && (
        <Button variant={"ghost"} type="button">
          {EndIcon}
        </Button>
      )}
    </div>
  );
}
