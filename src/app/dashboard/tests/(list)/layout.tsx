"use client";

import Filter from "@/components/custom/dashboard/filter";
import IconInput from "@/components/custom/icon-input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testStatus } from "@/constants/tabs";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("status");

  const [query, setQuery] = useQueryState("q");
  const [sort, setSort] = useQueryState("sort");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start items-center gap-3">
        <Tabs value={activeTab ?? "all"}>
          <TabsList>
            {testStatus.map((status) => (
              <Link href={status.path} key={status.id}>
                <TabsTrigger value={status.id}>{status.title}</TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
        <Link href={"/dashboard/tests/new"}>
          <Button>
            <Plus />
            <span>Create Test</span>
          </Button>
        </Link>
        <IconInput
          EndIcon={<Search />}
          className="rounded-full ml-auto w-[250px]"
          placeholder="Search..."
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* <Filter value={sort ?? ""} onValueChange={setSort} /> */}
      </div>
      {children}
    </div>
  );
}
