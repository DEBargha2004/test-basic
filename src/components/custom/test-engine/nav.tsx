import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AppLogo from "../app-logo";
import EndTestButton from "./end-test";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import TestInstruction from "./instruction";
import Timer from "./timer";
import { useTestEngine } from "@/providers/test-engine";

export default function TestEngineNav() {
  const { attempt } = useTestEngine();
  return (
    <nav className="py-3 flex justify-center bg-muted/60 border">
      <div className="w-4/5 flex justify-between items-center gap-2">
        <section className="flex justify-between items-center w-3/4">
          <AppLogo />
          <Timer
            deadline={attempt?.deadline as Date}
            className=""
            duration={attempt.duration as number}
          />
        </section>
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"outline"} className="ml-auto">
              <Info />
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
                duration: attempt?.duration as number,
                qCount: attempt?.questions.length as number,
                marksDistribution: attempt?.marksDistribution as {
                  positive: number;
                  negative: number;
                },
              }}
            />
          </SheetContent>
        </Sheet>
        <EndTestButton>End Test</EndTestButton>
      </div>
    </nav>
  );
}
