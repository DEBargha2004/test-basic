"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavigateBack() {
  const { back } = useRouter();
  return (
    <Button variant={"outline"} size={"icon"} onClick={back}>
      <ChevronLeft />
    </Button>
  );
}
