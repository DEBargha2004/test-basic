import { cn } from "@/lib/utils";
import React from "react";

type QuestionAttemptType = {
  id: string;
  label: string;
  isActive: (status: string) => boolean;
  icon: React.FC<React.ComponentProps<"div">>;
  primitives: string[];
};

export const questionAttemptTypes = [
  {
    id: "not-visited",
    primitives: ["not-visited"],
    label: "Not Visited",
    isActive(status) {
      return status === this.id;
    },
    icon: ({ className, children, ...props }) => (
      <div
        className={cn("size-5 border rounded-sm", className)}
        {...props}
        data-id="not-visited"
      >
        {children}
      </div>
    ),
  },
  {
    id: "marked",
    label: "Marked",
    primitives: ["marked"],
    isActive(status) {
      return status === this.id;
    },
    icon: ({ className, children, ...props }) => (
      <div
        className={cn("size-5 bg-purple-500/50 rounded-full", className)}
        {...props}
        data-id="marked"
      >
        {children}
      </div>
    ),
  },
  {
    id: "answered",
    label: "Answered",
    primitives: ["answered"],
    isActive(status) {
      return status === this.id;
    },
    icon: ({ className, children, ...props }) => (
      <div
        className={cn(
          "size-5 bg-emerald-500/50 rounded-sm rounded-t-xl",
          className
        )}
        {...props}
        data-id="answered"
      >
        {children}
      </div>
    ),
  },
  {
    id: "unanswered",
    label: "Unanswered",
    primitives: ["unanswered"],
    isActive(status) {
      return status === this.id;
    },
    icon: ({ className, children, ...props }) => (
      <div
        className={cn(
          "size-5 bg-amber-500/50 rounded-sm rounded-b-2xl",
          className
        )}
        {...props}
        data-id="unanswered"
      >
        {children}
      </div>
    ),
  },
  {
    id: "marked&answered",
    label: "Marked & Answered",
    primitives: ["marked", "answered"],
    isActive(status) {
      return status === this.id;
    },
    icon: ({ className, children, ...props }) => (
      <div
        className={cn(
          "size-5 bg-purple-500/50 rounded-full relative",
          className
        )}
        {...props}
        data-id="marked&answered"
      >
        {children}
        <span className="size-2 absolute top-0 right-0 bg-green-700 rounded-full" />
      </div>
    ),
  },
] as const satisfies QuestionAttemptType[];

export const getQuestionAttemptType = (status: AttemptStatus) => {
  return questionAttemptTypes.find((qat) => qat.isActive(status));
};
export const notVisited = questionAttemptTypes[0];
export const marked = questionAttemptTypes[1];
export const answered = questionAttemptTypes[2];
export const unanswered = questionAttemptTypes[3];
export const markedAndAnswered = questionAttemptTypes[4];

export type AttemptStatus = (typeof questionAttemptTypes)[number]["id"];
