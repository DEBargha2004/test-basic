import { updateTestStatus, Test } from "@/actions/test";
import { getImageUrl } from "@/lib/url";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Archive,
  ArchiveRestore,
  Clock,
  Dot,
  EllipsisVertical,
  ImageIcon,
  Pen,
  Pencil,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import SafeRemove from "./safe-remove";
import React from "react";
import { Separator } from "../ui/separator";
import { cn, formatDate } from "@/lib/utils";
import { archieved, isTestArchieved, published } from "@/constants/tabs";
import { formatInTimeZone } from "date-fns-tz";
import { toast } from "sonner";
import TestThumbnail from "./test-thumbnail";
import { useDashboardTests } from "@/providers/dashboard-tests-provider";

export default function TestCardAdmin({ data }: { data: Test }) {
  const { updateTest } = useDashboardTests();
  const handleArchieveTest = async () => {
    const res = await updateTestStatus(data.id.toString(), archieved.id);
    updateTest(data.id, { publishingStatus: archieved.id });
    if (res.success) return toast.success(res.message);

    return toast.error(res.message);
  };

  const handleRestoreTest = async () => {
    const res = await updateTestStatus(data.id.toString(), published.id);
    updateTest(data.id, { publishingStatus: published.id });
    if (res.success) return toast.success(res.message);

    return toast.error(res.message);
  };

  return (
    <div className="rounded-xl border overflow-hidden h-full flex flex-col">
      <section className="w-full aspect-video overflow-hidden border-b shrink-0">
        <Link href={`/tests/${data.id}`}>
          <TestThumbnail alt={data.title} path={data.thumbnail ?? ""} />
        </Link>
      </section>
      <section className="p-3 h-full grid gap-2">
        <div className="flex justify-start items-center gap-2">
          <h3 className="text-lg font-semibold">{data.title}</h3>
          {isTestArchieved(data.publishingStatus) && (
            <Archive size={16} className="text-amber-500" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full cursor-pointer ml-auto"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <Link href={`/dashboard/tests/${data.id}/edit`}>
                <DropdownMenuItem>
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              {data.publishingStatus !== "archieved" && (
                <SafeRemove
                  action={handleArchieveTest}
                  title="Archive Test"
                  description="Are you sure want to archive this test. You can undo it any time"
                  actionLabel="Archive"
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Archive />
                    <span>Archive</span>
                  </DropdownMenuItem>
                </SafeRemove>
              )}
              {data.publishingStatus === "archieved" && (
                <SafeRemove
                  action={handleRestoreTest}
                  title="Restore Test"
                  description="Are you sure want to restore this test. You can undo it any time"
                  actionLabel="Restore"
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ArchiveRestore />
                    <span>Restore</span>
                  </DropdownMenuItem>
                </SafeRemove>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {data.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <TestDetailBadge icon={<Clock size={16} />}>
            <span>{data.duration} min</span>
          </TestDetailBadge>
          <TestDetailBadge icon={<SquarePen size={16} />}>
            <span>{data.questionsCount} qs</span>
          </TestDetailBadge>
        </div>
        <div className="mt-auto flex justify-end gap-1 text-muted-foreground">
          <span className="text-xs">{data.attemptsCount} Attempts</span>
          <Dot size={16} className="scale-150" />
          <span
            className="text-xs"
            // suppressHydrationWarning
          >
            {formatInTimeZone(data.createdAt, "Asia/Kolkata", "Pp")}
          </span>
        </div>
      </section>
    </div>
  );
}

function TestDetailBadge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center gap-1.5 border rounded-full",
        "p-0.5 px-1.5 cursor-pointer hover:text-foreground/70"
      )}
    >
      {icon}
      <Separator orientation="vertical" />
      <span className="text-sm">{children}</span>
    </div>
  );
}
