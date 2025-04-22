"use client";

import { useEffect } from "react";
import { notVisited, unanswered } from "@/constants/question-attempt-types";
import { updateAttemptQuestion } from "@/actions/attempt";
import { useTestEngine } from "@/providers/test-engine";

export default function QuestionStatusHelper() {
  const { attempt, activeQuestionIndex, updateQuestion } = useTestEngine();
  const activeAttemptQuestionStatus =
    attempt?.questions[activeQuestionIndex]?.attemptStatus;
  const activeQuestionId = attempt?.questions[activeQuestionIndex]?.id;

  useEffect(() => {
    if (activeAttemptQuestionStatus === notVisited.id) {
      updateAttemptQuestion(activeQuestionId.toString(), {
        attemptStatus: unanswered.id,
      }).then((res) => {
        if (res.success) {
          updateQuestion(res.data!.id, {
            attemptStatus: res.data!.status,
            selectedOptionId: res.data!.selectedOptionId as string,
          });
        }
      });
    }
  }, [activeQuestionIndex, activeAttemptQuestionStatus, activeQuestionId]);

  return <></>;
}
