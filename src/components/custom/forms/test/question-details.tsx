import { Label } from "@/components/ui/label";
import { defaultQuestion, TTestSchema } from "@/schema/test";
import { TFormChildrenDefaultParams } from "@/types/form-default-params";
import { useFieldArray } from "react-hook-form";
import Question from "./question";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TestQuestionDetails({
  form,
}: TFormChildrenDefaultParams<TTestSchema>) {
  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleCreateNewQuestion = (index: number) => {
    const prevQuestions = form.getValues("questions");
    prevQuestions.splice(
      index,
      0,
      defaultQuestion(index + 1, { positive: 1, negative: 0 })
    );

    form.setValue("questions", prevQuestions);
  };
  return (
    <>
      {fields.map((ques, idx) => (
        <div key={ques.id} className="flex flex-col gap-4">
          <Label>Question {ques.serial}</Label>
          <Question form={form} index={idx} />
        </div>
      ))}
      <Button
        type="button"
        className="ml-auto"
        onClick={() => handleCreateNewQuestion(fields.length)}
      >
        <Plus />
        <span>New Question</span>
      </Button>
    </>
  );
}
