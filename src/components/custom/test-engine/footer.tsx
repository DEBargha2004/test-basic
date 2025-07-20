import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Attempt, updateAttemptQuestion } from "@/actions/attempt";
import {
  answered,
  AttemptStatus,
  marked,
  markedAndAnswered,
  unanswered,
} from "@/constants/question-attempt-types";
import { useTestEngine } from "@/providers/test-engine";

export default function TestEngineFooter() {
  const {
    attempt,
    activeQuestionIndex,
    setActiveQuestionIndex,
    updateQuestion,
    clearResponse,
  } = useTestEngine();

  const activeQuestion = attempt.questions[activeQuestionIndex]!;
  const selectedOption = activeQuestion.selectedOptionId;
  const isMarked =
    activeQuestion.attemptStatus === marked.id ||
    activeQuestion.attemptStatus === markedAndAnswered.id;

  const handleSaveAndNextQuestion = async () => {
    await updateAttemptQuestion(activeQuestion.id.toString(), {
      attemptStatus:
        activeQuestion.attemptStatus === marked.id
          ? selectedOption
            ? markedAndAnswered.id
            : marked.id
          : selectedOption
          ? answered.id
          : unanswered.id,
      selectedOptionId: activeQuestion.selectedOptionId ?? "",
    }).then((res) => {
      if (res.success) {
        updateQuestion(res.data!.id, {
          attemptStatus: res.data!.status,
          selectedOptionId: res.data!.selectedOptionId as string,
        });
      }
    });

    setActiveQuestionIndex(
      activeQuestionIndex + 1 >= (attempt?.questions.length ?? 0)
        ? 0
        : activeQuestionIndex + 1
    );
  };

  const handleToggleReview = () => {
    updateAttemptQuestion(activeQuestion.id.toString(), {
      attemptStatus:
        activeQuestion.attemptStatus === marked.id
          ? selectedOption
            ? answered.id
            : unanswered.id
          : selectedOption
          ? markedAndAnswered.id
          : marked.id,
    }).then((res) => {
      if (res.success) {
        updateQuestion(res.data!.id, {
          attemptStatus: res.data!.status,
        });
      }
    });
  };

  return (
    <footer
      className={cn(
        "p-4 w-full rounded-t-xl",
        "bg-muted/60 flex justify-start items-center gap-3"
      )}
    >
      <Button
        variant={
          activeQuestion.attemptStatus === marked.id ? "secondary" : "outline"
        }
        onClick={handleToggleReview}
      >
        {isMarked ? "Unmark" : "Mark for review"}
      </Button>
      <Button variant={"secondary"} onClick={clearResponse}>
        Clear response
      </Button>
      <NextQuestionButton
        className="ml-auto"
        onClick={handleSaveAndNextQuestion}
      >
        Save & Next
      </NextQuestionButton>
    </footer>
  );
}

export function NextQuestionButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      className={cn(
        "cursor-pointer",
        "bg-emerald-500 hover:bg-emerald-500/90 text-white",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
