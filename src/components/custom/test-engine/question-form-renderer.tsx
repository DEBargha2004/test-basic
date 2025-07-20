"use client";

import { Input } from "@/components/ui/input";
import { cn, sort } from "@/lib/utils";
import { useTestEngine } from "@/providers/test-engine";
import React from "react";

export default function QuestionFormRenderer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { activeQuestionIndex, attempt, updateAttempt } = useTestEngine();

  const activeQuestion = attempt?.questions[activeQuestionIndex];

  const handleSelectOption = (id: string) => {
    updateAttempt((prev) => {
      prev.questions[activeQuestionIndex].selectedOptionId = id;
    });
  };
  return (
    <div
      className={cn(
        "w-full shadow my-10 border rounded-xl p-5",
        "space-y-5",
        className
      )}
      {...props}
    >
      <section className="flex items-center gap-3">
        <h2 className="font-semibold">Q{activeQuestion?.serial}</h2>
        <QTag>+{attempt?.marksDistribution?.positive}</QTag>
        <QTag>{attempt?.marksDistribution?.negative}</QTag>
      </section>
      <section>
        <h3 className="text-lg text-foreground/80">{activeQuestion?.title}</h3>
      </section>
      <section className="grid grid-cols-2 gap-4">
        {activeQuestion?.options.map((op, i) => (
          <div
            key={op.opid}
            className={cn(
              "flex gap-2 items-center border p-4 rounded",
              "cursor-pointer transition-all hover:bg-accent/40",
              activeQuestion.selectedOptionId === op.opid &&
                "bg-amber-400/10 border-amber-400/60"
            )}
            onClick={() => handleSelectOption(op.opid)}
          >
            <Input
              className="size-3 accent-amber-400"
              type="radio"
              readOnly
              checked={activeQuestion.selectedOptionId === op.opid}
            />
            <label className="text-">{op.text}</label>
          </div>
        ))}
      </section>
    </div>
  );
}

function QTag({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-xs text-muted-foreground p-1 px-2 bg-accent rounded",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
