"use client";

import { Test } from "@/actions/test";
import TestCardPublic from "@/components/custom/test-card-public";
import { usePublicTests } from "@/providers/public-tests-provider";

export default function PublicTestsCSR() {
  const { tests } = usePublicTests();
  return tests.map((t) => <TestCardPublic data={t} key={t.id} />);
}
