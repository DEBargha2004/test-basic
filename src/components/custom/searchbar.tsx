"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import IconInput from "./icon-input";
import { useQueryState } from "nuqs";

export default function Searchbar({ placeholder }: { placeholder?: string }) {
  const [query, setQuery] = useQueryState("q");

  return (
    <div className="relative">
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
