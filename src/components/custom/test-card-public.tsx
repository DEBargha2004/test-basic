import { cn, formatDuration, getAcronym, getDurationInfo } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ArrowRight,
  Dot,
  EllipsisVertical,
  ImageIcon,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { PublicTestView } from "@/actions/test";
import { getImageUrl } from "@/lib/url";
import TestThumbnail from "./test-thumbnail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { usePublicTests } from "@/providers/public-tests-provider";

export default function TestCardPublic({ data }: { data: PublicTestView }) {
  const { hours, minutes, seconds } = getDurationInfo(data.duration * 60);
  const { handleAddToWishlist, handleDeleteFromWishlist } = usePublicTests();
  return (
    <div className="rounded-xl border overflow-hidden group">
      <Link href={`/tests/${data.id}`}>
        <section className="aspect-video w-full relative border-b">
          <TestThumbnail alt={data.title} path={data.thumbnail ?? ""} />
          <div
            className={cn(
              "absolute bottom-1 right-1 rounded bg-background/70",
              "transition-all hidden group-hover:block"
            )}
          >
            <span className="text-xs px-1 py-0.5 font-semibold">
              {hours ? `${hours}h` : null}
              {minutes ? `${minutes}m` : null}
              {seconds ? `${seconds}s` : null}
            </span>
          </div>
        </section>
      </Link>
      <section className="p-3 pb-5 flex justify-start items-start gap-2">
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={getImageUrl(data.user?.image ?? "")} />
          <AvatarFallback>{getAcronym(data.user?.name ?? "")}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-start w-full">
          <h1 className="font-medium line-clamp-2">{data.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.user?.name}
          </p>
          <div className="flex justify-start items-center gap-1 text-xs text-muted-foreground">
            <p className="whitespace-nowrap">{data.attemptsCount} Attempts</p>
            <Dot size={16} className="scale-[1.5]" />
            <p className="whitespace-nowrap">
              {formatInTimeZone(data.createdAt, "Asia/Kolkata", "dd/MM/yyyy")}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="rounded-full cursor-pointer size-7 shrink-0"
            >
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                data.isWishlisted
                  ? handleDeleteFromWishlist(data.id)
                  : handleAddToWishlist(data.id)
              }
            >
              <Star fill={data.isWishlisted ? "currentColor" : "none"} />
              {data.isWishlisted ? (
                <span>Remove from wishlist</span>
              ) : (
                <span>Add to wishlist</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
}
