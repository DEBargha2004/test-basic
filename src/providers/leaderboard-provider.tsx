"use client";

import { Ranker } from "@/actions/user";
import React, { createContext, useContext, useState } from "react";

type State = {
  attempters: Ranker[];
};

type Actions = {
  setAttempters: React.Dispatch<React.SetStateAction<State["attempters"]>>;
};

const leaderboardContext = createContext<(State & Actions) | undefined>(
  undefined
);

export default function LeaderboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [attempters, setAttempters] = useState<Ranker[]>([]);

  console.log(attempters);

  return (
    <leaderboardContext.Provider value={{ attempters, setAttempters }}>
      {children}
    </leaderboardContext.Provider>
  );
}

export const useLeaderboard = () => {
  const context = useContext(leaderboardContext);

  if (!context)
    throw new Error(
      "useLeaderboard cam only be used inside LeaderboardProvider"
    );

  return context;
};
