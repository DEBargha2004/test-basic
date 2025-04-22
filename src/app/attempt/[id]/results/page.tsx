import { getAttemptBasic } from "@/actions/attempt";
import NavigateBack from "@/components/custom/navigate-back";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { formatInTimeZone } from "date-fns-tz";
import { AlertCircle, Dot } from "lucide-react";
import AttemptError from "./_components/error";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getAttemptBasic(id);

  if (!res.success) return <AttemptError message={res.message} />;

  return (
    <Card className="w-full bg-background">
      <CardContent className="space-y-7">
        <NavigateBack />
        <div className="space-y-3">
          <h1 className="text-xl font-semibold">{res.data!.title}</h1>
          <p className="flex justify-start items-center gap-1 text-sm text-muted-foreground">
            <span>Attempt {res.data!.serial}</span>
            <Dot className="size-4 scale-125" />
            {formatInTimeZone(res.data!.createdAt, "Asia/Kolkata", "PPPp")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
