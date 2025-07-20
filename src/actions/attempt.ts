"use server";

import { QUERY_LIMIT } from "@/constants/query";
import {
  answered,
  AttemptStatus,
  notVisited,
} from "@/constants/question-attempt-types";
import {
  TDBAttemptScore,
  TDBOption,
  TDBTestAttemptQuestion,
  testAttemptQuestions,
  testAttempts,
  testQuestions,
  tests,
  users,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canUpdateQAStatus, getUniqueValues, sort } from "@/lib/utils";
import { TTestSubmission } from "@/types/test-submission";
import {
  and,
  count,
  desc,
  eq,
  gt,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { headers } from "next/headers";

async function getActiveAttempt(userId: string, testId: string) {
  const [attempt] = await db
    .select()
    .from(testAttempts)
    .where(
      and(
        eq(testAttempts.userId, userId),
        eq(testAttempts.testId, Number(testId)),
        isNull(testAttempts.submittedAt),
        gt(testAttempts.deadline, new Date())
      )
    );
  return attempt;
}

export async function createAttempt(testId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const [test] = await db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.id, Number(testId)),
        isNull(tests.deletedAt),
        eq(tests.publishingStatus, "published")
      )
    );
  if (!test) return { success: false, message: "Test not found" };

  const activeAttempt = await getActiveAttempt(user.id, testId);
  if (activeAttempt) return { success: true, attempt: activeAttempt };

  const attempt = await db.transaction(async (trx) => {
    const [prevAttempts] = await db
      .select({ count: count(testAttempts.id) })
      .from(testAttempts)
      .where(
        and(
          eq(testAttempts.userId, user.id),
          eq(testAttempts.testId, Number(testId))
        )
      );
    const deadline = new Date(new Date().getTime() + test.duration * 60 * 1000);
    const [attempt] = await trx
      .insert(testAttempts)
      .values({
        userId: user.id,
        testId: Number(testId),
        deadline: deadline,
        totalMarks: test.totalMarks,
        serial: prevAttempts.count + 1,
      })
      .returning();

    const testQuestionsInfo = await trx
      .select()
      .from(testQuestions)
      .where(eq(testQuestions.testId, Number(testId)));

    const attemptQuestions: TDBTestAttemptQuestion[] = testQuestionsInfo.map(
      (q) => ({
        attemptId: attempt.id,
        questionId: q.id,
        attemptStatus: notVisited.id,
        timeSpent: 0,
      })
    );

    await trx.insert(testAttemptQuestions).values(attemptQuestions);

    return attempt;
  });

  return { success: true, attempt };
}

type AttemptQuestion = {
  id: number;
  title: string;
  serial: number;
  options: TDBOption[];
  attemptStatus: string;
  selectedOptionId?: string;
};

export type Attempt = NonNullable<
  Awaited<ReturnType<typeof getAttempt>>["data"]
>;
export async function getAttempt(attemptId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const [attempt] = await db
    .select({
      id: testAttempts.id,
      title: tests.title,
      description: tests.description,
      // thumbnail: tests.thumbnail,
      duration: tests.duration,
      totalMarks: tests.totalMarks,
      passMarks: tests.passMarks,
      deadline: testAttempts.deadline,
      marksDistribution: tests.marksDistribution,
      questions: sql<AttemptQuestion[]>`ARRAY_AGG(
          JSONB_BUILD_OBJECT(
            'id', ${testAttemptQuestions.id},
            'title', ${testQuestions.title},
            'serial', ${testQuestions.serial},
            'options', ${testQuestions.options},
            'attemptStatus', ${testAttemptQuestions.attemptStatus},
            'selectedOptionId', ${testAttemptQuestions.selectedOptionId}
          )
        )`,
    })
    .from(testAttempts)
    .leftJoin(users, eq(users.id, testAttempts.userId))
    .leftJoin(tests, eq(tests.id, testAttempts.testId))
    .leftJoin(
      testAttemptQuestions,
      eq(testAttemptQuestions.attemptId, testAttempts.id)
    )
    .leftJoin(
      testQuestions,
      eq(testAttemptQuestions.questionId, testQuestions.id)
    )
    .where(
      and(
        eq(testAttempts.id, Number(attemptId)),
        eq(testAttempts.userId, user.id),
        isNull(testAttempts.submittedAt)
      )
    )
    .groupBy(
      testAttempts.id,
      tests.title,
      tests.description,
      tests.duration,
      tests.totalMarks,
      tests.passMarks,
      testAttempts.deadline,
      tests.marksDistribution
    );

  if (attempt) attempt.questions = sort(attempt?.questions ?? [], "serial");

  if (!attempt)
    return { success: false, message: "Attempt not found or submitted" };

  if (attempt.deadline < new Date())
    return { success: false, message: "Time limit exceeded" };

  return { success: true, data: attempt };
}

export async function updateAttemptQuestion(
  id: string,
  {
    attemptStatus,
    selectedOptionId,
  }: { attemptStatus?: AttemptStatus; selectedOptionId?: string }
) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });

  if (!id) return { success: false, message: "Question id not provided" };

  if (!attemptStatus && !selectedOptionId)
    return {
      success: false,
      message: "Nothing to update",
    };

  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [attemptQuestion] = await db
    .select({
      id: testAttemptQuestions.id,
      qid: testAttemptQuestions.questionId,
      attemptStatus: testAttemptQuestions.attemptStatus,
    })
    .from(testAttemptQuestions)
    .where(eq(testAttemptQuestions.id, Number(id)));

  // console.log({ attemptQuestion, attemptStatus, selectedOptionId });

  if (!attemptQuestion)
    return { success: false, message: "Attempt question not found" };

  const currentStatus = attemptQuestion.attemptStatus as AttemptStatus;
  const canUpdate =
    attemptStatus && canUpdateQAStatus(currentStatus, attemptStatus);

  // console.log({ canUpdate, attemptStatus });

  const [attempt] = await db
    .update(testAttemptQuestions)
    .set({
      ...(canUpdate ? { attemptStatus } : {}),
      ...(selectedOptionId !== undefined ? { selectedOptionId } : {}),
    })
    .from(testAttempts)
    .where(
      and(
        eq(testAttemptQuestions.id, attemptQuestion.id),
        isNull(testAttempts.submittedAt),
        gt(testAttempts.deadline, new Date()),
        eq(testAttempts.userId, user.id)
      )
    )
    .returning();

  // console.group(attempt);

  return {
    success: true,
    data: {
      id: attempt.id,
      status: attempt.attemptStatus as AttemptStatus,
      selectedOptionId: attempt.selectedOptionId,
    },
  };
}

export async function submitAttempt(
  attemptId: string,
  submitData: TTestSubmission
) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const bufferTime = 5 * 1000;
  //submit time is reduced by buffer time
  const compromisedSubmitTime = new Date(new Date().getTime() - bufferTime);

  const [attempt] = await db
    .select({
      testId: tests.id,
      attemptId: testAttempts.id,
      marksDistribution: tests.marksDistribution,
      deadline: testAttempts.deadline,
      duration: tests.duration,
      createdAt: testAttempts.createdAt,
    })
    .from(testAttempts)
    .innerJoin(tests, eq(tests.id, testAttempts.testId))
    .innerJoin(users, eq(users.id, testAttempts.userId))
    .where(
      and(
        isNull(testAttempts.submittedAt),
        gt(testAttempts.deadline, compromisedSubmitTime),
        eq(testAttempts.id, Number(attemptId)),
        eq(testAttempts.userId, user.id)
      )
    )
    .groupBy();

  if (!attempt) return { success: false, message: "Attempt not found" };

  /**
   * @description `submissionDuration` is in seconds
   */
  const submissionDuration = Math.floor(
    (new Date().getTime() - attempt.createdAt.getTime()) / 1000
  );

  await db.transaction(async (trx) => {
    const attemptQuestions = await trx
      .select({
        id: testAttemptQuestions.id,
        attemptStatus: testAttemptQuestions.attemptStatus,
        selectedOption: testAttemptQuestions.selectedOptionId,
        correctOptionId: testQuestions.correctOptionId,
      })
      .from(testAttemptQuestions)
      .leftJoin(
        testQuestions,
        eq(testQuestions.id, testAttemptQuestions.questionId)
      )
      .where(eq(testAttemptQuestions.attemptId, attempt.attemptId));

    // remove duplicates due to malicious activity
    submitData.questions = getUniqueValues(
      submitData.questions,
      "attemptQuestionId"
    );

    let score = {
      total: 0,
      positive: 0,
      negative: 0,
      unsanswered: 0,
    };

    // test evaluation
    attemptQuestions.forEach((question) => {
      const submittedAnswer = submitData.questions.find(
        (answer) => answer.attemptQuestionId === question.id.toString()
      );

      question.selectedOption = submittedAnswer?.selectedOptionId ?? "";

      //if unanswered
      if (!question.selectedOption) {
        score.unsanswered += attempt.marksDistribution.positive;
      }
      //if correct
      else if (question.selectedOption === question.correctOptionId) {
        score.total += attempt.marksDistribution.positive;
        score.positive += attempt.marksDistribution.positive;
      } else {
        score.total += attempt.marksDistribution.negative;
        score.negative += attempt.marksDistribution.negative;
      }
    });

    //update attempt questions
    await Promise.all(
      attemptQuestions.map((question) => {
        return trx
          .update(testAttemptQuestions)
          .set({ selectedOptionId: question.selectedOption })
          .where(eq(testAttemptQuestions.id, question.id));
      })
    );

    await trx
      .update(testAttempts)
      .set({
        submittedAt: new Date(),
        attemptDuration: submissionDuration,
        score: {
          marks: score.total,
          negativeMarks: score.negative,
          positiveMarks: score.positive,
          unansweredMarks: score.unsanswered,
        } as TDBAttemptScore,
      })
      .where(eq(testAttempts.id, attempt.attemptId));
  });

  return { success: true, message: "Attempt submitted successfully" };
}

export async function getAttempts(testId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  // console.log({ userInfo });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const attempts = await db
    .select({
      id: testAttempts.id,
      createdAt: testAttempts.createdAt,
      submittedAt: testAttempts.submittedAt,
      deadline: testAttempts.deadline,
      serial: testAttempts.serial,
    })
    .from(testAttempts)
    .where(
      and(
        eq(testAttempts.testId, Number(testId)),
        eq(testAttempts.userId, user.id)
      )
    )
    .orderBy(desc(testAttempts.createdAt));

  return {
    success: true,
    data: attempts,
  };
}

export async function getAttemptBasic(attemptId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [attempt] = await db
    .select({
      id: testAttempts.id,
      title: tests.title,
      serial: testAttempts.serial,
      createdAt: testAttempts.createdAt,
    })
    .from(testAttempts)
    .leftJoin(tests, eq(tests.id, testAttempts.testId))
    .where(
      and(
        eq(testAttempts.id, Number(attemptId)),
        or(eq(testAttempts.userId, user.id), eq(tests.userId, user.id)),
        isNotNull(testAttempts.submittedAt)
      )
    );

  if (!attempt) return { success: false, message: "Attempt not found" };

  return {
    success: true,
    data: attempt,
  };
}

export async function getAttemptMarks(attemptId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const [attempt] = await db
    .select({
      id: testAttempts.id,
      score: testAttempts.score,
      totalMarks: testAttempts.totalMarks,
    })
    .from(testAttempts)
    .leftJoin(tests, eq(tests.id, testAttempts.testId))
    .where(
      and(
        eq(testAttempts.id, Number(attemptId)),
        or(eq(testAttempts.userId, user.id), eq(tests.userId, user.id)),
        isNotNull(testAttempts.submittedAt)
      )
    );

  if (!attempt) return { success: false, message: "Attempt not found" };

  return {
    success: true,
    data: attempt,
  };
}

export async function getAttemptQuestionsResponse(attemptId: string) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;
  const attemptQuestions = await db
    .select({
      id: testAttemptQuestions.id,
      attemptStatus: testAttemptQuestions.attemptStatus,
      serial: testQuestions.serial,
      title: testQuestions.title,
      options: testQuestions.options,
      correctOption: testQuestions.correctOptionId,
      selectedOption: testAttemptQuestions.selectedOptionId,
      marksDistribution: tests.marksDistribution,
    })
    .from(testAttemptQuestions)
    .leftJoin(
      testQuestions,
      eq(testQuestions.id, testAttemptQuestions.questionId)
    )
    .leftJoin(testAttempts, eq(testAttempts.id, testAttemptQuestions.attemptId))
    .leftJoin(tests, eq(tests.id, testAttempts.testId))
    .where(
      and(
        eq(testAttempts.id, Number(attemptId)),
        or(eq(testAttempts.userId, user.id), eq(tests.userId, user.id)),
        isNotNull(testAttempts.submittedAt)
      )
    );

  return {
    success: true,
    data: attemptQuestions,
  };
}

export type TUsersTestAttempts = NonNullable<
  Awaited<ReturnType<typeof getUsersTestAttempts>>["data"]
>[number];

export async function getUsersTestAttempts({
  isUser = false,
  q,
  page = 0,
}: {
  isUser?: boolean;
  q?: string;
  page?: number;
}) {
  const userInfo = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userInfo) return { success: false, message: "Not logged in" };

  const { user } = userInfo;

  const attempts = await db
    .select({
      id: testAttempts.id,
      title: tests.title,
      serial: testAttempts.serial,
      createdAt: testAttempts.createdAt,
      submittedAt: testAttempts.submittedAt,
      deadline: testAttempts.deadline,
      score: testAttempts.score,
      totalMarks: testAttempts.totalMarks,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
      count: sql<number>`count(*) over ()`,
    })
    .from(testAttempts)
    .leftJoin(tests, eq(tests.id, testAttempts.testId))
    .leftJoin(users, eq(users.id, testAttempts.userId))
    .where(
      and(
        isUser ? eq(testAttempts.userId, user.id) : eq(tests.userId, user.id),
        ...(q !== undefined
          ? [
              or(
                gt(sql`SIMILARITY(${tests.title}, ${q})`, 0.2),
                gt(sql`SIMILARITY(${users.name}, ${q})`, 0.2),
                gt(sql`SIMILARITY(${users.email}, ${q})`, 0.2)
              ),
            ]
          : [])
      )
    )
    .orderBy(
      q !== undefined
        ? sql`GREATEST(
          SIMILARITY(${tests.title}, ${q}),
          SIMILARITY(${users.name}, ${q}),
          SIMILARITY(${users.email}, ${q})
        )`
        : desc(testAttempts.createdAt)
    )
    .offset(page * QUERY_LIMIT)
    .limit(QUERY_LIMIT);

  return {
    success: true,
    data: attempts,
  };
}
