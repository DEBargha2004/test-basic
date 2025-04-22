import { getAttempt } from "@/actions/attempt";
import TestEngine from "@/components/custom/test-engine";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getAttempt(id);

  if (!res.success)
    return (
      <main className="flex justify-center items-center h-screen">
        <Alert variant={"destructive"} className="w-1/2">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{res.message}</AlertDescription>
        </Alert>
      </main>
    );

  return (
    <main>
      {/**@ts-ignore */}
      <TestEngine attempt={res.data!} />
    </main>
  );
}
