import Filter from "@/components/custom/dashboard/filter";
import IconInput from "@/components/custom/icon-input";
import Searchbar from "@/components/custom/searchbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testStatus } from "@/constants/tabs";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import PublishingStatusTabs from "./_components/tabs";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start items-center gap-3">
        <Suspense>
          <PublishingStatusTabs />
        </Suspense>
        <Link href={"/dashboard/tests/new"}>
          <Button>
            <Plus />
            <span>Create Test</span>
          </Button>
        </Link>
        <Suspense>
          <Searchbar className="w-[250px] ml-auto" />
        </Suspense>
        {/* <IconInput
          EndIcon={<Search />}
          className="rounded-full ml-auto w-[250px]"
          placeholder="Search..."
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        /> */}
        {/* <Filter value={sort ?? ""} onValueChange={setSort} /> */}
      </div>
      {children}
    </div>
  );
}
