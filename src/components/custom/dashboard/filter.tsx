import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { testFilterOptions } from "@/constants/dashboard-sidebar";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react";

export default function Filter({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"secondary"} className="relative">
          <ListFilter />
          <div
            className={cn(
              "size-3 absolute hidden top-0.5 -translate-y-1/2 -right-0.5",
              "rounded-full dark:bg-emerald-500 bg-emerald-400",
              value && "block"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="p-1 font-semibold">
          Filter By
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {testFilterOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.id}
            checked={option.id === value}
            onCheckedChange={() => onValueChange(option.id)}
          >
            <span>{option.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
