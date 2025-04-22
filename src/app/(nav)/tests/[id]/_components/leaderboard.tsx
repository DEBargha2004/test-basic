"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDuration, getAcronym } from "@/lib/utils";
import { Dot } from "lucide-react";
import rank1 from "@/../public/rank1.svg";
import rank2 from "@/../public/rank2.svg";
import rank3 from "@/../public/rank3.svg";
import Image from "next/image";
import { useEffect } from "react";
import { getAttemptersByRank } from "@/actions/user";
import { useLeaderboard } from "@/providers/leaderboard-provider";

export function Leaderboard({
  children,
  asChild,
  testId,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  testId: string;
}) {
  const { attempters, setAttempters } = useLeaderboard();

  useEffect(() => {
    getAttemptersByRank(testId).then((res) => {
      if (res.success) {
        setAttempters(res.data);
      }
    });
  }, [testId]);

  return (
    <Sheet>
      <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="px-10">
          <SheetTitle className="text-xl">Leaderboard</SheetTitle>
          <SheetDescription>
            Ranking is based on marks. Total test duration past to answer the
            last question in the test will be considered to break the tie.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-10 pb-5">
          {attempters.map((attempter, i) => (
            <div
              key={attempter.userId}
              className="flex justify-start items-center gap-4"
            >
              <div className="w-14 flex justify-center">
                <Rank rank={i + 1} />
              </div>
              <Avatar className="size-14 border ml-2">
                <AvatarImage />
                <AvatarFallback>
                  {getAcronym(attempter.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{attempter.username}</h2>
                <p className="flex justify-start items-center gap-1 text-sm text-muted-foreground">
                  <span>{attempter.marks} marks</span>
                  <Dot size={16} className="scale-125" />
                  <span>{formatDuration(attempter.attemptDuration)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Rank({ rank }: { rank: number }) {
  switch (rank) {
    case 1:
      return <Image src={rank1} alt="rank1" height={30} width={30} />;
    case 2:
      return <Image src={rank2} alt="rank2" height={30} width={30} />;
    case 3:
      return <Image src={rank3} alt="rank3" height={30} width={30} />;
    default:
      return <span className="text-sm">#{rank}</span>;
      break;
  }
}
