"use client";

import { createAttempt } from "@/actions/attempt";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function StartTestButton({ testId }: { testId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartTest = async () => {
    setLoading(true);
    const res = await createAttempt(testId);
    setLoading(false);

    if (!res.success) return toast.error(res.message);

    router.push(`/attempt/${res.attempt!.id}`);
  };

  return (
    <Button onClick={handleStartTest} disabled={loading || !testId}>
      {loading ? <Loader2 className="animate-spin" /> : <span>Start Test</span>}
    </Button>
  );
}
