"use client";

import { getUsersTestAttempts, TUsersTestAttempts } from "@/actions/attempt";
import { QUERY_LIMIT } from "@/constants/query";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import React, { createContext, useContext, useEffect, useState } from "react";

type State = {
  attempts: TUsersTestAttempts[];
  page: { prev: number; next: number };
};

type actions = {
  setAttempts: React.Dispatch<React.SetStateAction<State["attempts"]>>;
  setPage: React.Dispatch<React.SetStateAction<State["page"]>>;
};

const attemptsContext = createContext<(State & actions) | undefined>(undefined);

export default function AttemptsProvider({
  children,
  defaultValue,
  fetcherAction,
  isUser = false,
  nextPage,
  prevPage,
}: {
  children: React.ReactNode;
  defaultValue?: Partial<State>;
  fetcherAction: typeof getUsersTestAttempts;
  isUser?: boolean;
  prevPage: number;
  nextPage: number;
}) {
  const [attempts, setAttempts] = useState<State["attempts"]>(
    defaultValue?.attempts ?? []
  );
  const [query] = useQueryState("q");
  const [page] = useQueryState("page");
  const deboundedQuery = useDebounce(query, 500);
  const [{ prev, next }, setPage] = useState({
    prev: prevPage,
    next: nextPage,
  });

  useEffect(() => {
    fetcherAction({
      q: deboundedQuery || undefined,
      isUser,
      page: Number(page || 0),
    }).then((res) => {
      if (res.success) {
        setAttempts(res.data ?? []);
        const currentPage = Number(page || 0);
        const minPage = 0;
        const maxPage = Math.floor(
          Number(res.data?.[0]?.count ?? 0) / QUERY_LIMIT
        );

        const prevPage = Math.max(minPage, currentPage - 1);
        const nextPage = Math.min(maxPage, currentPage + 1);
        setPage({ prev: prevPage, next: nextPage });
      }
    });
  }, [deboundedQuery, isUser, page]);

  return (
    <attemptsContext.Provider
      value={{
        attempts,
        setAttempts,
        page: { prev, next },
        setPage,
      }}
    >
      {children}
    </attemptsContext.Provider>
  );
}

export const useAttempts = () => {
  const context = useContext(attemptsContext);

  if (!context)
    throw new Error("useAttempts must be used within AttemptsProvider");

  return context;
};
