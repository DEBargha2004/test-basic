"use server";

import { published } from "@/constants/tabs";
import {
  CURRENT_TIMESTAMP,
  TDBMarks,
  TDBOption,
  TDBQuestion,
  testAttempts,
  testQuestions,
  tests,
  users,
  wishlists,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sort } from "@/lib/utils";
import { testSchema, TTestSchema } from "@/schema/test";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { headers } from "next/headers";

export async function createTest(formdata: TTestSchema) {
  const { success } = testSchema.safeParse(formdata);
  if (!success) return { success: false, message: "Invalid form data" };

  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const res = await db.transaction(async (trx) => {
    const [test] = await trx
      .insert(tests)
      .values({
        title: formdata.title,
        description: formdata.description,
        userId: user.id,
        duration: formdata.duration,
        totalMarks: formdata.totalMarks,
        publishingStatus: formdata.publishingStatus,
        thumbnail: formdata.thumbnail,
        passMarks: formdata.passMarks,
        marksDistribution: formdata.marksDistribution,
      })
      .returning();

    const questionsBulk = formdata.questions.map((q) => ({
      title: q.title,
      serial: q.serial,
      correctOptionId: q.correctOptionId,
      options: q.options,
      testId: test.id,
    })) as TDBQuestion[];

    await trx.insert(testQuestions).values(questionsBulk);

    return test;
  });

  return { success: true, message: "Test created successfully" };
}

export type Test = NonNullable<
  Awaited<ReturnType<typeof getTestsOfUser>>["data"]
>[number];
export async function getTestsOfUser({
  q,
  status,
}: {
  q?: string;
  status?: string;
}) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  status = status === "all" ? undefined : status;

  const { user } = userInfo;
  const resp = await db
    .select({
      id: tests.id,
      title: tests.title,
      description: tests.description,
      thumbnail: tests.thumbnail,
      duration: tests.duration,
      totalMarks: tests.totalMarks,
      passMarks: tests.passMarks,
      publishingStatus: tests.publishingStatus,
      createdAt: tests.createdAt,
      questionsCount: countDistinct(testQuestions.id),
      attemptsCount: countDistinct(testAttempts.id),
      user: {
        name: users.name,
        image: users.image,
        id: users.id,
      },
    })
    .from(tests)
    .leftJoin(testQuestions, eq(tests.id, testQuestions.testId))
    .leftJoin(users, eq(users.id, tests.userId))
    .leftJoin(testAttempts, eq(testAttempts.testId, tests.id))
    .where(
      and(
        ...(status ? [eq(tests.publishingStatus, status)] : []),
        eq(tests.userId, user.id),
        isNull(testQuestions.deletedAt),
        ...(q
          ? [
              or(
                gte(sql`SIMILARITY(${tests.title}::TEXT, ${q})`, 0.2),
                gte(sql`SIMILARITY(${tests.description}::TEXT,${q})`, 0.2)
              ),
            ]
          : [])
      )
    )
    .orderBy(
      q
        ? desc(sql`
              GREATEST(
                SIMILARITY(${tests.title}::TEXT, ${q}),
                SIMILARITY(${tests.description}::TEXT,${q})
              )
          `)
        : desc(tests.createdAt)
    )
    .groupBy(tests.id, users.name, users.image, users.id);

  return { success: true, data: resp };
}

export type PublicTestView = Awaited<
  ReturnType<typeof getTests>
>["data"][number];
export async function getTests({ q }: { q?: string }) {
  const resp = await db
    .select({
      id: tests.id,
      title: tests.title,
      description: tests.description,
      thumbnail: tests.thumbnail,
      duration: tests.duration,
      totalMarks: tests.totalMarks,
      passMarks: tests.passMarks,
      publishingStatus: tests.publishingStatus,
      createdAt: tests.createdAt,
      questionsCount: count(testQuestions.id),
      attemptsCount: countDistinct(testAttempts.id),
      isWishlisted: countDistinct(wishlists.testId),
      user: {
        name: users.name,
        image: users.image,
        id: users.id,
      },
    })
    .from(tests)
    .leftJoin(testQuestions, eq(tests.id, testQuestions.testId))
    .leftJoin(users, eq(users.id, tests.userId))
    .leftJoin(
      wishlists,
      and(eq(tests.id, wishlists.testId), eq(wishlists.userId, users.id))
    )
    .leftJoin(testAttempts, eq(testAttempts.testId, tests.id))
    .where(
      and(
        eq(tests.publishingStatus, published.id),
        isNull(testQuestions.deletedAt)
      )
    )
    .orderBy(desc(tests.createdAt))
    .groupBy(tests.id, users.name, users.image, users.id);

  return { success: true, data: resp };
}

type Question = {
  id: number;
  title: string;
  serial: number;
  options: TDBOption[];
  correctOptionId: string;
  marks: TDBMarks;
};

export type TRootTest = NonNullable<
  Awaited<ReturnType<typeof getRootTestInfo>>["data"]
>;
export async function getRootTestInfo(testId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [test] = await db
    .select({
      id: tests.id,
      title: tests.title,
      description: tests.description,
      userId: tests.userId,
      thumbnail: tests.thumbnail,
      duration: tests.duration,
      totalMarks: tests.totalMarks,
      passMarks: tests.passMarks,
      publishingStatus: tests.publishingStatus,
      marksDistribution: tests.marksDistribution,
      questions: sql<Question[]>`ARRAY_AGG(
      JSONB_BUILD_OBJECT(
        'id', ${testQuestions.id},
        'title', ${testQuestions.title},
        'serial', ${testQuestions.serial},
        'options', ${testQuestions.options},
        'correctOptionId', ${testQuestions.correctOptionId}
      )
    )`,
    })
    .from(tests)
    .leftJoin(testQuestions, eq(tests.id, testQuestions.testId))
    .groupBy(tests.id)
    .where(eq(tests.id, Number(testId)));

  test.questions = sort(test.questions, "serial");

  if (!test) return { success: false, message: "Test not found" };
  if (test.userId !== user.id)
    return {
      success: false,
      message: "You are not eligible to access the test details",
    };

  return { success: true, data: test };
}

export async function getBasicTestInfo(testId: string) {
  const [test] = await db
    .select({
      id: tests.id,
      title: tests.title,
      description: tests.description,
      thumbnail: tests.thumbnail,
      duration: tests.duration,
      totalMarks: tests.totalMarks,
      passMarks: tests.passMarks,
      publishingStatus: tests.publishingStatus,
      questionsCount: count(testQuestions.id),
      marksDistribution: tests.marksDistribution,
      user: {
        name: users.name,
        image: users.image,
        id: users.id,
        email: users.email,
      },
    })
    .from(tests)
    .leftJoin(testQuestions, eq(tests.id, testQuestions.testId))
    .leftJoin(users, eq(users.id, tests.userId))
    .where(
      and(
        eq(tests.id, Number(testId)),
        eq(tests.publishingStatus, published.id),
        isNull(tests.deletedAt)
      )
    )
    .groupBy(tests.id, users.name, users.image, users.id);

  if (!test) return { success: false, message: "Test not found" };
  return { success: true, data: test };
}

export async function updateTest(testId: string, formdata: TTestSchema) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [creator] = await db
    .select({ id: tests.userId })
    .from(tests)
    .where(eq(tests.id, Number(testId)));

  if (!creator) return { success: false, message: "Test not found" };
  if (creator.id !== user.id)
    return { success: false, message: "You are not eligible to edit the test" };

  await db.transaction(async (trx) => {
    await trx
      .update(tests)
      .set({
        title: formdata.title,
        description: formdata.description,
        thumbnail: formdata.thumbnail,
        duration: formdata.duration,
        totalMarks: formdata.totalMarks,
        passMarks: formdata.passMarks,
        publishingStatus: formdata.publishingStatus,
        marksDistribution: formdata.marksDistribution,
      })
      .where(eq(tests.id, Number(testId)));

    const prevSavedQuestion = await db
      .select()
      .from(testQuestions)
      .where(
        and(
          eq(testQuestions.testId, Number(testId)),
          isNull(testQuestions.deletedAt)
        )
      );

    const newQuestions = formdata.questions.filter(
      (q) => !prevSavedQuestion.some((oq) => oq.id === Number(q.qid))
    );
    const deletedQuestions = prevSavedQuestion.filter(
      (oq) => !formdata.questions.some((q) => oq.id === Number(q.qid))
    );
    const updatedQuestions = formdata.questions.filter((q) =>
      prevSavedQuestion.some((oq) => oq.id === Number(q.qid))
    );

    await Promise.all(
      updatedQuestions.map(async (q) => {
        await trx
          .update(testQuestions)
          .set({
            title: q.title,
            serial: q.serial,
            options: q.options,
            correctOptionId: q.correctOptionId,
          })
          .where(eq(testQuestions.id, Number(q.qid)));
      })
    );

    await Promise.all(
      newQuestions.map(async (q) => {
        await trx.insert(testQuestions).values({
          testId: Number(testId),
          title: q.title,
          serial: q.serial,
          options: q.options,
          correctOptionId: q.correctOptionId,
        });
      })
    );

    await Promise.all(
      deletedQuestions.map(async (q) => {
        await trx
          .update(testQuestions)
          .set({ deletedAt: CURRENT_TIMESTAMP })
          .where(eq(testQuestions.id, Number(q.id)));
      })
    );
  });

  return { success: true, message: "Test updated successfully" };
}

export async function updateTestStatus(testId: string, status: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [creator] = await db
    .select({ id: tests.userId })
    .from(tests)
    .where(eq(tests.id, Number(testId)));

  if (!creator) return { success: false, message: "Test not found" };
  if (creator.id !== user.id)
    return { success: false, message: "You are not eligible to edit the test" };

  await db
    .update(tests)
    .set({ publishingStatus: status })
    .where(eq(tests.id, Number(testId)));

  return { success: true, message: "Test status updated successfully" };
}

async function getWishlist_Internal(userId: string) {
  return await db
    .select({
      id: tests.id,
      title: tests.title,
      attemptsCount: countDistinct(testAttempts.id),
      thumbnail: tests.thumbnail,
      createdAt: tests.createdAt,
    })
    .from(wishlists)
    .leftJoin(tests, eq(tests.id, wishlists.testId))
    .leftJoin(testAttempts, eq(testAttempts.testId, tests.id))
    .where(eq(wishlists.userId, userId))
    .groupBy(tests.id, tests.title)
    .orderBy(desc(tests.createdAt));
}

export async function getWishlistOfUserBasic() {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const wishlist = await getWishlist_Internal(user.id);

  return { success: true, data: wishlist };
}

export async function getWishlistOfUser() {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const resp = await db
    .select({
      id: tests.id,
      title: tests.title,
      description: tests.description,
      thumbnail: tests.thumbnail,
      duration: tests.duration,
      totalMarks: tests.totalMarks,
      passMarks: tests.passMarks,
      publishingStatus: tests.publishingStatus,
      createdAt: tests.createdAt,
      questionsCount: count(testQuestions.id),
      attemptsCount: countDistinct(testAttempts.id),
      isWishlisted: countDistinct(wishlists.testId),
      user: {
        name: users.name,
        image: users.image,
        id: users.id,
      },
    })
    .from(tests)
    .leftJoin(testQuestions, eq(tests.id, testQuestions.testId))
    .leftJoin(users, eq(users.id, tests.userId))
    .leftJoin(wishlists, eq(tests.id, wishlists.testId))
    .leftJoin(testAttempts, eq(testAttempts.testId, tests.id))
    .where(
      and(
        eq(tests.publishingStatus, published.id),
        isNull(testQuestions.deletedAt),
        eq(wishlists.userId, user.id)
      )
    )
    .orderBy(desc(tests.createdAt))
    .groupBy(tests.id, users.name, users.image, users.id);

  return { success: true, data: resp };
}

export async function addToWishlist(testId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [test] = await db
    .select({ id: tests.id })
    .from(tests)
    .where(eq(tests.id, Number(testId)));

  if (!test) return { success: false, message: "Test not found" };

  await db.insert(wishlists).values({ userId: user.id, testId: test.id });

  return {
    success: true,
    message: "Test added to wishlist successfully",
  };
}

export async function deleteFromWishlist(testId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [test] = await db
    .select({ id: tests.id })
    .from(tests)
    .where(eq(tests.id, Number(testId)));

  if (!test) return { success: false, message: "Test not found" };

  await db
    .delete(wishlists)
    .where(and(eq(wishlists.userId, user.id), eq(wishlists.testId, test.id)));

  return {
    success: true,
    message: "Test removed from wishlist successfully",
  };
}
