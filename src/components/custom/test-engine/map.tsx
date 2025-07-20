import { Attempt } from "@/actions/attempt";
import {
  AttemptStatus,
  getQuestionAttemptType,
  questionAttemptTypes,
} from "@/constants/question-attempt-types";
import { cn } from "@/lib/utils";
import { useTestEngine } from "@/providers/test-engine";
import { useAtom, useAtomValue } from "jotai";

export default function TestQuestionsMap() {
  const { activeQuestionIndex, attempt, setActiveQuestionIndex } =
    useTestEngine();

  const qat = getQuestionAttemptType(
    attempt?.questions[activeQuestionIndex]?.attemptStatus as AttemptStatus
  )!;

  // console.log(attempt?.questions);

  return (
    <div className="h-full flex flex-col border-x w-[300px] shrink-0">
      <section className="p-5 grid grid-cols-2 gap-4 border-b">
        {questionAttemptTypes.map((qat) => (
          <div key={qat.id} className="flex items-center gap-2">
            <qat.icon className="shrink-0" />
            <span className=" whitespace-nowrap">{qat.label}</span>
          </div>
        ))}
      </section>
      <section
        className={cn(
          "h-full overflow-y-auto auto-rows-max",
          "grid grid-cols-5 gap-3 p-5"
        )}
      >
        {attempt?.questions.map((q, i) => (
          <div key={q.id} onClick={() => setActiveQuestionIndex(i)}>
            <QStatus index={i} />
          </div>
        ))}
      </section>
    </div>
  );
}

function QStatus({ index }: { index: number }) {
  const { attempt, activeQuestionIndex } = useTestEngine();
  const qat = getQuestionAttemptType(
    (attempt?.questions[index]?.attemptStatus ?? "not-visited") as AttemptStatus
  )!;

  const question = attempt?.questions[index];

  return (
    <qat.icon
      className={cn(
        "size-8 grid place-content-center text-xs font-semibold cursor-pointer border",
        activeQuestionIndex === index && "border-foreground"
      )}
    >
      {question?.serial}
    </qat.icon>
  );
}
