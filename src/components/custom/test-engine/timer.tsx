"use client";

import { cn, getDurationInfo } from "@/lib/utils";
import { useTestEngine } from "@/providers/test-engine";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Timer({
  className,
  deadline,
  duration,
  ...props
}: React.ComponentProps<"h2"> & {
  deadline: Date;
  duration: number;
}) {
  const [timeLeft, setTimeLeft] = useState(
    Math.floor((new Date(deadline).getTime() - Date.now()) / 1000)
  );
  const { hours, minutes, seconds } = getDurationInfo(timeLeft);
  const { submitTest, attempt } = useTestEngine();
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearTimeout(timer);

          setTimeout(() => {
            submitTest().then((res) => {
              if (res.success) {
                toast.success(res.message);
                router.push(`/attempt/${attempt.id}/results`);
              }
            });
          }, 0);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [attempt.id]);

  return (
    <h2
      className={cn("font-semibold", className)}
      {...props}
      suppressHydrationWarning
    >
      {hours ? `${hours}`.padStart(2, "0") + ":" : ""}
      {minutes ? `${minutes}`.padStart(2, "0") + ":" : "00:"}
      {seconds ? `${seconds}`.padStart(2, "0") : "00"}
    </h2>
  );
}
