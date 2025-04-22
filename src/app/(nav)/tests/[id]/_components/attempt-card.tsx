import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { ChevronRight, FileIcon } from "lucide-react";

export function AttemptCard({
  attemptNum,
  createdAt,
  isActive,
}: {
  attemptNum: number;
  createdAt: Date;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-start items-center gap-4 p-3 rounded-md border",
        "transition-all hover:bg-muted/50 group"
      )}
    >
      <section>
        <Button
          variant={"secondary"}
          size={"icon"}
          className="size-10 rounded-full border"
        >
          <FileIcon className="size-5 text-muted-foreground" />
        </Button>
      </section>
      <section className="flex-1 space-y-1">
        <h2 className="font-semibold flex items-center gap-2">
          Attempt {attemptNum}
          {isActive && (
            <span className="inline-block size-2 rounded-full bg-red-400 animate-pulse" />
          )}
        </h2>
        <p className="text-xs text-muted-foreground">
          {formatInTimeZone(createdAt, "Asia/Kolkata", "dd/MM/yyyy hh:mm a")}
        </p>
      </section>
      <section className="flex items-center mr-5">
        <ChevronRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1.5" />
      </section>
    </div>
  );
}
