"use server";

import { published } from "@/constants/tabs";
import { testAttempts, tests } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, count, eq, isNotNull, isNull } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAttemptsCount() {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [attempts] = await db
    .select({
      count: count(testAttempts.id),
    })
    .from(testAttempts)
    .where(
      and(eq(testAttempts.userId, user.id), isNotNull(testAttempts.submittedAt))
    );

  return {
    success: true,
    data: attempts,
  };
}

export async function getYourTestsCount() {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [userTests] = await db
    .select({ count: count(tests.id) })
    .from(tests)
    .where(
      and(eq(tests.publishingStatus, published.id), eq(tests.userId, user.id))
    );

  return {
    success: true,
    data: userTests,
  };
}

export async function getTotalAttemptsInUserTests() {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const [totalAttempts] = await db
    .select({
      count: count(testAttempts.id),
    })
    .from(tests)
    .leftJoin(testAttempts, eq(tests.id, testAttempts.testId))
    .where(eq(tests.userId, user.id));

  return {
    success: true,
    data: totalAttempts,
  };
}
