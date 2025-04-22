import {
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./schema";
import { InferInsertModel, sql } from "drizzle-orm";
import { TOptionSchema } from "@/schema/test";

export * from "@/../auth-schema";

export const CURRENT_TIMESTAMP = sql`CURRENT_TIMESTAMP`;
export const CURRENT_DATE = sql`TIMEZONE('Asia/Kolkata', CURRENT_TIMESTAMP)::DATE`;

export type TDBMarks = {
  positive: number;
  negative: number;
};

export type TDBOption = TOptionSchema;
export type TDBAttemptScore = {
  marks: number;
  positiveMarks: number;
  negativeMarks: number;
  unansweredMarks: number;
};

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  marksDistribution: jsonb("marks_distribution").$type<TDBMarks>().notNull(),
  totalMarks: integer("total_marks").notNull(),
  publishingStatus: varchar("publishing_status").notNull(),
  thumbnail: text("thumbnail"),
  passMarks: integer("pass_marks").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(CURRENT_TIMESTAMP),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const testQuestions = pgTable("test_questions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id")
    .notNull()
    .references(() => tests.id),
  serial: integer("serial").notNull(),
  title: varchar("title").notNull(),
  options: jsonb("options").$type<TDBOption[]>().notNull(),
  correctOptionId: text("correct_option_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(CURRENT_TIMESTAMP),
  deletedAt: timestamp("deleted_at"),
});

export const testAttempts = pgTable("test_attempts", {
  id: serial("id").primaryKey(),
  testId: integer("test_id")
    .notNull()
    .references(() => tests.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  serial: integer("serial").notNull(),
  totalMarks: integer("total_marks").notNull(),
  score: jsonb("score").$type<TDBAttemptScore>(),
  attemptDuration: integer("attempt_duration"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(CURRENT_TIMESTAMP),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
});

export const testAttemptQuestions = pgTable("test_attempt_questions", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id")
    .notNull()
    .references(() => testAttempts.id),
  questionId: integer("question_id")
    .notNull()
    .references(() => testQuestions.id),
  timeSpent: integer("time_spent").notNull(),
  selectedOptionId: text("selected_option_id"),
  attemptStatus: text("attempt_status").notNull(),
  marks: jsonb("marks").$type<TDBMarks>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(CURRENT_TIMESTAMP),
});

export const wishlists = pgTable(
  "wishlists",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    testId: integer("test_id")
      .notNull()
      .references(() => tests.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(CURRENT_TIMESTAMP),
  },
  (table) => {
    return [primaryKey({ columns: [table.userId, table.testId] })];
  }
);

export type TDBQuestion = InferInsertModel<typeof testQuestions>;
export type TDBTestAttemptQuestion = InferInsertModel<
  typeof testAttemptQuestions
>;
