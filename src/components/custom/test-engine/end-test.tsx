"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AttemptStatus,
  questionAttemptTypes,
} from "@/constants/question-attempt-types";
import { cn } from "@/lib/utils";
import { useTestEngine } from "@/providers/test-engine";
import {
  answered,
  unanswered,
  marked,
  notVisited,
} from "@/constants/question-attempt-types";
import React, { useState } from "react";
import { submitAttempt } from "@/actions/attempt";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EndTestButton({
  className,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { attempt, isTestSubmitting, submitTest } = useTestEngine();
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await submitTest();

    if (res.success) {
      toast.success(res.message);
      router.push(`/attempt/${attempt.id}/results`);
    } else {
      toast.error(res.message);
    }
  };

  const getAttemptStatus = (status: AttemptStatus) => {
    return attempt.questions.filter((q) => q.attemptStatus === status);
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {asChild ? (
          children
        ) : (
          <Button
            variant={"outline"}
            className={cn(
              "text-destructive hover:text-destructive w-40 cursor-pointer",
              className
            )}
            {...props}
          >
            {children}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="2xl:w-1/3 w-1/2 mx-auto border">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Want to end the test?</DrawerTitle>
          <DrawerDescription className="text-lg">
            No changes would be allowed after submission
          </DrawerDescription>
        </DrawerHeader>
        <section className="grid grid-cols-2 gap-2 p-3">
          <QAS>
            <QASIcon className="grid grid-cols-2">
              <answered.icon className="size-3/4 mb-auto mr-auto" />
              <unanswered.icon className="size-full" />
              <marked.icon className="size-full" />
              <notVisited.icon className="size-3/4 m-auto" />
            </QASIcon>
            <QASData>
              <QASLabel>Total Questions</QASLabel>
              <QASCount>{attempt.questions.length}</QASCount>
            </QASData>
          </QAS>
          {questionAttemptTypes.map((qat) => (
            <QAS key={qat.id}>
              <QASIcon>
                <qat.icon
                  className={cn(
                    "size-10 [&>span]:size-4 [&>span]:translate-x-0.5",
                    "data-[id=answered]:rounded-t-3xl data-[id=unanswered]:rounded-b-3xl"
                  )}
                />
              </QASIcon>
              <QASData>
                <QASLabel>{qat.label}</QASLabel>
                <QASCount>{getAttemptStatus(qat.id).length}</QASCount>
              </QASData>
            </QAS>
          ))}
        </section>
        <DrawerFooter className="gap-2 flex-row">
          <DrawerClose asChild>
            <Button variant={"outline"} type="button" className="w-1/2">
              Resume
            </Button>
          </DrawerClose>
          <Button
            className="w-1/2"
            disabled={isTestSubmitting}
            onClick={handleSubmit}
          >
            {isTestSubmitting && <Loader2 className="animate-spin" />}
            <span>End Test</span>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function QAS({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className="p-0 py-3 bg-background ">
      <CardContent
        className={cn(
          "flex flex-row gap-2 justify-start items-center",
          className
        )}
        {...props}
      >
        {children}
      </CardContent>
    </Card>
  );
}

function QASIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("size-16 flex items-center justify-start", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function QASData({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("", className)} {...props}>
      {children}
    </section>
  );
}

function QASLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("text-lg text-muted-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

function QASCount({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-semibold", className)} {...props}>
      {children}
    </h3>
  );
}
