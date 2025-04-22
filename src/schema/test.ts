import { publishingStatus, testStatus } from "@/constants/tabs";
import { nanoid } from "nanoid";
import * as z from "zod";

export const optionSchema = z.object({
  opid: z.string(),
  serial: z.number(),
  text: z.string().min(1, { message: "Option must be at least 1 characters" }),
});

export const questionSchema = z
  .object({
    qid: z.string(),
    serial: z.number(),
    title: z.string().min(1, { message: "Title must be at least 1 character" }),
    options: z.array(optionSchema).min(2),
    correctOptionId: z.string(),
  })
  .superRefine(({ options, correctOptionId }, ctx) => {
    if (!options.some((op) => op.opid === correctOptionId)) {
      ctx.addIssue({
        code: "custom",
        path: ["title"],
        message: "Please select a correct option",
      });
    }
  });

export const testSchema = z
  .object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters" }),
    description: z.string(),
    duration: z
      .number()
      .min(1, { message: "Duration must be at least 1 minute" }),
    marksDistribution: z.object({
      positive: z.number().refine((val) => Number(val) > 0, {
        message: "Marks must be greater than 0",
      }),
      negative: z.number(),
    }),
    totalMarks: z
      .number()
      .min(1, { message: "Total Marks must be at least 1" }),
    publishingStatus: z.string(),
    thumbnail: z.string().optional(),
    passMarks: z.number(),
    questions: z.array(questionSchema).min(1),
  })
  .superRefine(({ totalMarks, passMarks }, ctx) => {
    if (passMarks > totalMarks) {
      ctx.addIssue({
        code: "custom",
        path: ["passMarks"],
        message: "Pass Marks must be less than Total Marks",
      });
    }
  })
  .superRefine(({ questions, totalMarks, marksDistribution }, ctx) => {
    const questionMarks = questions.length * marksDistribution.positive;

    if (questionMarks !== totalMarks) {
      ctx.addIssue({
        code: "custom",
        path: ["totalMarks"],
        message: "Total Marks must be equal to the sum of question marks",
      });
    }
  });

export type TTestSchema = z.infer<typeof testSchema>;
export type TOptionSchema = z.infer<typeof optionSchema>;
export type TQuestionSchema = z.infer<typeof questionSchema>;

export const defaultValues = (): TTestSchema => ({
  title: "",
  description: "",
  duration: 1,
  totalMarks: 1,
  publishingStatus: publishingStatus[0].id,
  passMarks: 1,
  marksDistribution: { positive: 1, negative: 0 },
  questions: [defaultQuestion(1)],
});

export const defaultOption = (serial: number): TOptionSchema => ({
  opid: nanoid(),
  serial,
  text: "",
});

export const defaultQuestion = (serial: number): TQuestionSchema => ({
  qid: nanoid(),
  serial,
  correctOptionId: "",
  title: "",
  options: [defaultOption(1), defaultOption(2)],
});

export const rebalanceSerial = (list: Record<string, any>[], key: string) => {
  list.forEach((item, index) => {
    item[key] = index + 1;
  });
};
