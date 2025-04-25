"use server";

import { QUERY_LIMIT } from "@/constants/query";
import { testAttempts, tests, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, asc, desc, eq, gt, isNotNull, max, or, sql } from "drizzle-orm";
import { headers } from "next/headers";

export type TAttempter = NonNullable<
  Awaited<ReturnType<typeof getAttempters>>["data"]
>[number];

export async function getAttempters({
  query,
  page = 0,
}: {
  query?: string;
  page?: number;
}) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const attempters = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      email: users.email,
      count: sql<number>`count(*) over()`,
    })
    .from(testAttempts)
    .leftJoin(tests, eq(tests.id, testAttempts.testId))
    .leftJoin(users, eq(users.id, testAttempts.userId))
    .groupBy(users.id, users.name, users.image, users.email)
    .where(
      and(
        eq(tests.userId, user.id),
        ...(query
          ? [
              or(
                gt(sql`SIMILARITY(${users.name}, ${query})`, 0.2),
                gt(sql`SIMILARITY(${users.email}, ${query})`, 0.2)
              ),
            ]
          : [])
      )
    )
    .orderBy(
      query
        ? sql`GREATEST(
            SIMILARITY(${users.name},${query}),
            SIMILARITY(${users.email},${query})
        )`
        : users.name
    )
    .offset(page * QUERY_LIMIT)
    .limit(QUERY_LIMIT);
  return {
    success: true,
    data: attempters,
  };
}

export type Ranker = {
  userId: string;
  username: string;
  avatar: string;
  marks: number;
  attemptDuration: number;
};

export async function getAttemptersByRank(testId: string) {
  const marksExp = sql`(test_attempts.score ->> 'marks')::INT`;

  const data = await db.execute(
    sql<Ranker[]>`
      with max_scores as (
        select 
          user_id,
          ${max(marksExp)} as max_score
        from 
          ${testAttempts}
        where 
          ${testAttempts.testId}=${testId}
          and ${isNotNull(testAttempts.submittedAt)}
        group by ${testAttempts.userId}
        order by ${desc(max(marksExp))}
      )
      select distinct on (${testAttempts.userId})
        ms.user_id as "userId",
        users.name as username,
        users.image as avatar,
        ${marksExp} as marks,
        test_attempts.attempt_duration as "attemptDuration"
      from ${testAttempts}
      join max_scores ms 
      on ${and(
        eq(sql`ms.user_id`, testAttempts.userId),
        eq(sql`ms.max_score`, marksExp)
      )}
      join users
      on ${testAttempts.userId} = ${users.id}
      where ${testAttempts.testId} = ${testId}
      order by ${testAttempts.userId}, ${asc(testAttempts.attemptDuration)};
    `
  );

  // console.log(data.rows);

  return { success: true, data: data.rows as Ranker[] };
}
