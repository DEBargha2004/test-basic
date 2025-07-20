import { cn } from "@/lib/utils";
import React from "react";

export default function TestInstruction({
  className,
  data,
  ...props
}: React.ComponentProps<"ul"> & {
  data: {
    qCount: number;
    duration: number;
    marksDistribution: { positive: number; negative: number };
  };
}) {
  return (
    <ul className={cn("space-y-3 ml-9 list-disc", className)} {...props}>
      <li>
        The test contains {data?.qCount} question{data?.qCount > 1 && "s"} which
        have to be attempted within duration of {data?.duration} minute
        {data?.duration > 1 && "s"} or less.
      </li>
      <li>
        All questions carry {data?.marksDistribution.positive} mark
        {data.marksDistribution.positive !== 1 && "s"} and incorrect responses
        carry negative {data?.marksDistribution.negative}&nbsp; mark
        {data?.marksDistribution.negative !== 1 && "s"} for each question.
      </li>
      <li>No marks would be awarded or deducted for unattempted questions.</li>
    </ul>
  );
}
