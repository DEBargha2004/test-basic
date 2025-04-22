import { Test } from "@/actions/test";
import { PopoverClose } from "@radix-ui/react-popover";
import { formatInTimeZone } from "date-fns-tz";
import { Dot } from "lucide-react";
import Link from "next/link";
import TestThumbnail from "./test-thumbnail";

export type TestCardMiniViewProps = {
  id: number;
  title: string;
  thumbnailPath: string;
  attemptsCount: number;
  createdAt: Date;
};

export function TestCardMiniView({
  id,
  title,
  thumbnailPath,
  attemptsCount,
  createdAt,
}: TestCardMiniViewProps) {
  return (
    <div className="flex justify-start items-center gap-2">
      <section className="h-12 w-12 aspect-square shrink-0 rounded overflow-hidden border">
        <TestThumbnail alt={title} path={thumbnailPath} />
      </section>
      <section className="flex-1 space-y-1">
        <PopoverClose asChild>
          <Link href={`/tests/${id}`}>
            <h1 className="text-sm font-semibold hover:underline line-clamp-1">
              {title}
            </h1>
          </Link>
        </PopoverClose>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span>{attemptsCount} Attempts</span>
          <Dot size={16} className="scale-125" />
          <span>
            {formatInTimeZone(createdAt, "Asia/Kolkata", "dd/MM/yyyy")}
          </span>
        </p>
      </section>
    </div>
  );
}
