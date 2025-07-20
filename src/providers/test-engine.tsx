"use client";

import { Attempt, submitAttempt } from "@/actions/attempt";
import React, { createContext, useContext, useState } from "react";
import { produce } from "immer";
import { sort } from "@/lib/utils";

type State = {
  attempt: Attempt;
  activeQuestionIndex: number;
  isTestSubmitting: boolean;
};

type Action = {
  updateAttempt: (fn: (prev: Attempt) => void) => void;
  setActiveQuestionIndex: React.Dispatch<
    React.SetStateAction<State["activeQuestionIndex"]>
  >;
  updateQuestion: (
    id: number,
    data: Partial<Attempt["questions"][number]>
  ) => void;
  submitTest: () => Promise<{ success: boolean; message: string }>;
  clearResponse: () => void;
};

export const testEngineContext = createContext<(State & Action) | undefined>(
  undefined
);

export default function TestEngineProvider({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: Attempt;
}) {
  const [attempt, setAttempt] = useState<Attempt>(() => {
    //sort questions
    defaultValue.questions = sort(defaultValue.questions, "serial");
    //sort options
    defaultValue.questions = defaultValue.questions.map((q) => {
      q.options = sort(q.options, "serial");
      return q;
    });
    return defaultValue;
  });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);

  const updateAttempt = (recipie: (prev: Attempt) => void) => {
    setAttempt(
      produce((draft) => {
        recipie(draft);
      })
    );
  };

  const updateQuestion = (
    id: number,
    data: Partial<Attempt["questions"][number]>
  ) => {
    setAttempt(
      produce((draft) => {
        const selectedQuestion = draft.questions.find((q) => q.id === id);
        if (selectedQuestion) {
          Object.assign(selectedQuestion, data);
        }
      })
    );
  };

  const submitTest = async () => {
    setIsTestSubmitting(true);
    const res = await submitAttempt(attempt.id.toString(), {
      questions: attempt.questions.map((q) => ({
        attemptQuestionId: q.id.toString(),
        attemptStatus: q.attemptStatus,
        selectedOptionId: q.selectedOptionId ?? "",
      })),
    });
    setIsTestSubmitting(false);
    return res;
  };

  const clearResponse = () => {
    updateQuestion(attempt.questions[activeQuestionIndex].id, {
      selectedOptionId: "",
    });
  };

  return (
    <testEngineContext.Provider
      value={{
        attempt,
        updateAttempt,
        activeQuestionIndex,
        setActiveQuestionIndex,
        updateQuestion,
        submitTest,
        isTestSubmitting,
        clearResponse,
      }}
    >
      {children}
    </testEngineContext.Provider>
  );
}

export const useTestEngine = () => {
  const context = useContext(testEngineContext);

  if (!context)
    throw new Error("useTestEngine must be used within TestEngineProvider");

  return context;
};
