"use client";

import { Attempt } from "@/actions/attempt";
import TestEngineBody from "./body";
import TestQuestionsMap from "./map";
import TestEngineNav from "./nav";
import QuestionStatusHelper from "./question-status-helper";
import TestEngineProvider from "@/providers/test-engine";

export default function TestEngine({ attempt }: { attempt: Attempt }) {
  return (
    <TestEngineProvider defaultValue={attempt}>
      <div className="flex flex-col h-[100dvh]">
        <TestEngineNav />
        <div className="flex justify-between gap-2 h-[calc(100dvh-62px)] w-4/5 mx-auto">
          <TestEngineBody />
          <TestQuestionsMap />
        </div>
        <QuestionStatusHelper />
      </div>
    </TestEngineProvider>
  );
}
