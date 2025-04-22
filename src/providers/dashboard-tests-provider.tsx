"use client";

import { Test } from "@/actions/test";
import { produce } from "immer";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { createContext, useContext, useEffect, useState } from "react";

type State = {
  tests: Test[];
};

type Action = {
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
  updateTest: (id: number, data: Partial<Test>) => void;
  removeTest: (id: number) => void;
};

const testContext = createContext<State & Action>({} as State & Action);

export default function DashboardTestsProvider({
  children,
  defaultTests,
}: {
  children: React.ReactNode;
  defaultTests: Test[];
}) {
  const [tests, setTests] = useState<Test[]>(defaultTests);
  const [status] = useQueryState("status");

  const filterTests = (tests: Test[]) => {
    // console.log({ status });
    if (!status || status === "all") return tests;
    return tests.filter((test) => test.publishingStatus === status);
  };

  const updateTest = (id: number, data: Partial<Test>) => {
    setTests(
      produce((tests) => {
        const testIdx = tests.findIndex((t) => t.id === id);
        if (testIdx !== -1) {
          Object.assign(tests[testIdx], data);
          tests.splice(testIdx, 1);
        }
      })
    );
  };

  const removeTest = (id: number) => {
    setTests((tests) => tests.filter((t) => t.id !== id));
  };

  return (
    <testContext.Provider value={{ tests, setTests, updateTest, removeTest }}>
      {children}
    </testContext.Provider>
  );
}

export function useDashboardTests() {
  const context = useContext(testContext);

  if (!context)
    throw new Error(
      "useDashboardTests must be used within DashboardTestsProvider"
    );

  return context;
}
