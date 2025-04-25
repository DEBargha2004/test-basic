import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlertCircle, Dot, FileText } from "lucide-react";
import TestInstruction from "@/components/custom/test-engine/instruction";
import NavigateBack from "@/components/custom/navigate-back";
import StartTestButton from "./_components/start-test";
import { getBasicTestInfo } from "@/actions/test";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDuration, getAcronym } from "@/lib/utils";
import TestThumbnail from "@/components/custom/test-thumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/url";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resp = await getBasicTestInfo(id);

  if (!resp.success)
    return (
      <main className="w-full h-full place-content-center">
        <Alert variant={"destructive"}>
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{resp.message}</AlertDescription>
        </Alert>
      </main>
    );

  return (
    <>
      <section className="border rounded-xl shadow p-10">
        <NavigateBack />
        <div className="flex justify-between items-center">
          <section className="space-y-8">
            <h1 className="text-xl font-semibold">{resp.data?.title}</h1>

            <section className="flex justify-start items-center gap-2 font-medium">
              <h2>{resp.data?.questionsCount} Q&apos;s</h2>
              <Dot size={16} className="scale-[1.5]" />
              <h2>
                {resp.data?.passMarks} / {resp.data?.totalMarks} marks
              </h2>
              <Dot size={16} className="scale-[1.5]" />
              <h2>{formatDuration((resp.data?.duration ?? 0) * 60)}</h2>
            </section>

            <section className="flex justify-start items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Start Test</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">
                      Instructions
                    </SheetTitle>
                  </SheetHeader>
                  <TestInstruction
                    data={{
                      duration: resp.data?.duration ?? 0,
                      marksDistribution: resp.data?.marksDistribution ?? {
                        positive: 0,
                        negative: 0,
                      },
                      qCount: resp.data?.questionsCount ?? 0,
                    }}
                  />
                  <SheetFooter>
                    <StartTestButton testId={id} />
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant={"secondary"}>
                    <FileText />
                    <span>Instructions</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">
                      Instructions
                    </SheetTitle>
                  </SheetHeader>
                  <TestInstruction
                    data={{
                      duration: resp.data?.duration ?? 0,
                      marksDistribution: resp.data?.marksDistribution ?? {
                        positive: 0,
                        negative: 0,
                      },
                      qCount: resp.data?.questionsCount ?? 0,
                    }}
                  />
                </SheetContent>
              </Sheet>
            </section>
          </section>
          <section className="h-[240px] aspect-[1.6]">
            <div className="h-full rounded-xl overflow-hidden border hover:[&>img]:scale-105 [&>img]:transition-all">
              <TestThumbnail
                path={resp.data?.thumbnail ?? ""}
                alt={resp.data?.title ?? ""}
              />
            </div>
          </section>
        </div>
      </section>
      <section className="border rounded-xl shadow p-10 space-y-3">
        <h1 className="text-xl font-semibold">Description</h1>
        <p className="text-sm text-muted-foreground">
          {resp.data?.description}
        </p>
        <section className="flex justify-start items-center gap-2 mt-10">
          <Avatar className="size-9">
            <AvatarImage src={getImageUrl(resp.data?.user?.image ?? "")} />
            <AvatarFallback>
              {getAcronym(resp.data?.user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold">{resp.data?.user?.name}</h2>
            <p className="text-xs text-muted-foreground">
              {resp.data?.user?.email}
            </p>
          </div>
        </section>
      </section>
    </>
  );
}
