"use client";

import { getTestsOfUser, Test } from "@/actions/test";
import TestCard from "@/components/custom/test-card-admin";
import { useDashboardTests } from "@/providers/dashboard-tests-provider";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function CSRenderer() {
  const { tests, setTests } = useDashboardTests();
  const [query] = useQueryState("q");
  const [sort] = useQueryState("sort");
  const [status] = useQueryState("status");
  const deboundedQuery = useDebounce(query, 500);

  useEffect(() => {
    getTestsOfUser({
      q: deboundedQuery as string,
      status: status as string,
    }).then((res) => {
      // if (!res.success) return toast("Error", { description: res.message });

      setTests(res.data ?? []);
    });
  }, [deboundedQuery, status, sort]);

  return tests.map((test) => <TestCard key={test.id} data={test} />);
}
