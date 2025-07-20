"use client";

import { getTestsOfUser, Test } from "@/actions/test";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { published } from "@/constants/tabs";
import { getImageUrl } from "@/lib/url";
import { creationsAtom } from "@/store/creation";
import { PopoverClose } from "@radix-ui/react-popover";
import { formatInTimeZone } from "date-fns-tz";
import { useAtom } from "jotai";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { TestCardMiniView } from "../test-card-mini-view";

export default function MyCreations({
  children,
}: {
  children: React.ReactNode;
}) {
  const [creations, setCreations] = useAtom(creationsAtom);

  useEffect(() => {
    getTestsOfUser({ status: published.id }).then((res) => {
      if (res.success) {
        setCreations(res.data ?? []);
      }
    });
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex flex-col justify-start items-center p-0">
        <div className="p-4 w-full space-y-2">
          {!creations.length && (
            <p className="text-center">
              Your havn&apos;t created any exams yet
            </p>
          )}
          {creations.map((test) => (
            <TestCardMiniView
              key={test.id}
              title={test.title}
              thumbnailPath={test.thumbnail ?? ""}
              attemptsCount={test.attemptsCount}
              createdAt={test.createdAt}
              id={test.id}
            />
          ))}
        </div>
        <Separator />
        <div className="p-4 w-full space-y-2">
          <PopoverClose asChild>
            <Link href={"/dashboard/tests/new"}>
              <Button variant={"secondary"} className="w-full">
                Create a Test
              </Button>
            </Link>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
