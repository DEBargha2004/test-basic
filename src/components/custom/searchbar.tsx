"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import IconInput from "./icon-input";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

export default function Searchbar({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useQueryState("q");

  return (
    <div className={cn("relative", className)}>
      <IconInput
        className="rounded-full"
        placeholder={placeholder ?? "Search..."}
        EndIcon={<SearchIcon />}
        value={query ?? ""}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
