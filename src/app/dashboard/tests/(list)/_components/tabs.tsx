"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testStatus } from "@/constants/tabs";
import Link from "next/link";
import { useQueryState } from "nuqs";

export default function PublishingStatusTabs() {
  const [activeStatus] = useQueryState("status");
  return (
    <Tabs value={activeStatus ?? "all"}>
      <TabsList>
        {testStatus.map((status) => (
          <Link href={status.path} key={status.id}>
            <TabsTrigger value={status.id}>{status.title}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
