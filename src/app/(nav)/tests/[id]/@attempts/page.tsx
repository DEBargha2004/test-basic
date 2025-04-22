import { AlertCircle } from "lucide-react";
import { getAttempts } from "@/actions/attempt";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AttemptCard } from "../_components/attempt-card";
import React from "react";
import { Leaderboard } from "../_components/leaderboard";
import LeaderboardProvider from "@/providers/leaderboard-provider";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const attempts = await getAttempts(id);

  const isActive = (id: number) => {
    const attempt = attempts.data!.find((a) => a.id === id);
    if (!attempt) return false;
    return attempt.submittedAt === null && attempt.deadline > new Date();
  };

  if (!attempts.success) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{attempts.message}</AlertDescription>
      </Alert>
    );
  }
  return (
    <LeaderboardProvider>
      <section className="border rounded-xl shadow p-10 space-y-3">
        <div className="flex justify-between items-baseline">
          <h1 className="text-xl font-semibold">Attempts</h1>
          <Leaderboard testId={id}>
            <p className="text-sm underline font-medium">View leaderboard</p>
          </Leaderboard>
        </div>
        <div className="grid gap-2">
          {attempts.data!.map((attempt, i) => (
            <Link
              key={i}
              href={
                isActive(attempt.id)
                  ? `/attempt/${attempt.id}`
                  : `/attempt/${attempt.id}/results`
              }
            >
              <AttemptCard
                attemptNum={attempt.serial}
                createdAt={attempt.createdAt}
                isActive={isActive(attempt.id)}
              />
            </Link>
          ))}
        </div>
      </section>
    </LeaderboardProvider>
  );
}
