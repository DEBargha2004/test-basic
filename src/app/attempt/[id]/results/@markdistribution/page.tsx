import { getAttemptMarks } from "@/actions/attempt";
import AttemptError from "../_components/error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getAttemptMarks(id);

  if (!res.success) return <AttemptError message={res.message} />;

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Overview</h1>
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              TOTAL MARKS SCORED
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-start items-baseline gap-1">
            <Mark>{res.data?.score?.marks}</Mark>
            <span className="text-xs text-muted-foreground">
              /{res.data?.totalMarks} marks
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              CORRECT
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-start items-baseline gap-1">
            <Mark className="text-green-500">
              {res.data?.score?.positiveMarks}
            </Mark>
            <span className="text-xs text-muted-foreground">marks</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              INCORRECT
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-start items-baseline gap-1">
            <Mark className="text-red-500">
              {res.data?.score?.negativeMarks}
            </Mark>
            <span className="text-xs text-muted-foreground">marks</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              UNANSWERED
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-start items-baseline gap-1">
            <Mark className="text-orange-400">
              {res.data?.score?.unansweredMarks}
            </Mark>
            <span className="text-xs text-muted-foreground">marks</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Mark({ className, children, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1 className={cn("text-3xl font-semibold", className)} {...props}>
      {children}
    </h1>
  );
}
