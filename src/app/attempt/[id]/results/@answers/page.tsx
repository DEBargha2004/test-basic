import { getAttemptQuestionsResponse } from "@/actions/attempt";
import AttemptError from "../_components/error";
import { Card, CardContent } from "@/components/ui/card";
import { TDBMarks, TDBOption } from "@/db/schema";
import { sort } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getAttemptQuestionsResponse(id);

  if (!res.success) return <AttemptError message={res.message} />;

  if (res.data) res.data = sort(res.data, "serial");

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Answers</h1>
      <div className="grid gap-4">
        {res.data?.map((question) => (
          <AttemptQuestionResponse
            key={question.id}
            title={question.title!}
            options={question.options!}
            serial={question.serial!}
            marksDistribution={question.marksDistribution!}
            correctOptionId={question.correctOption!}
            selectedOptionId={question.selectedOption!}
          />
        ))}
      </div>
    </div>
  );
}

function AttemptQuestionResponse({
  title,
  options,
  serial,
  marksDistribution,
  correctOptionId,
  selectedOptionId,
}: {
  title: string;
  options: TDBOption[];
  serial: number;
  marksDistribution: TDBMarks;
  correctOptionId: string;
  selectedOptionId: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <section className="space-y-1">
          <h1 className="font-semibold">Question {serial}</h1>
          {!selectedOptionId ? (
            <p className="text-destructive text-sm">YOU DIDN'T ATTEMPT</p>
          ) : (
            <>
              {selectedOptionId !== correctOptionId && (
                <p className="text-destructive text-xs">
                  -{Math.abs(marksDistribution.negative)} MARK
                </p>
              )}
              {selectedOptionId === correctOptionId && (
                <p className="text-green-500 text-xs">
                  +{Math.abs(marksDistribution.positive)} MARK
                </p>
              )}
            </>
          )}
        </section>
        <section>
          <h1 className="text-lg">{title}</h1>
        </section>
        <section className="grid grid-cols-2 gap-2">
          {options.map((op, i) => (
            <div
              key={op.opid}
              className="border rounded p-4 space-y-1 h-20 flex flex-col justify-center items-start"
            >
              <p>{op.text}</p>
              {selectedOptionId === op.opid && op.opid === correctOptionId && (
                <p className="text-sm text-green-500">YOUR ANSWER</p>
              )}
              {correctOptionId === op.opid && selectedOptionId !== op.opid && (
                <p className="text-sm text-green-500">CORRECT ANSWER</p>
              )}
              {selectedOptionId === op.opid && op.opid !== correctOptionId && (
                <p className="text-sm text-destructive">INCORRECT</p>
              )}
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
