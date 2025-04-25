import { getTotalAttemptsInUserTests } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await getTotalAttemptsInUserTests();
  return (
    <Card>
      <CardHeader className="space-y-0 flex flex-row justify-between">
        <CardTitle>Total Attempts</CardTitle>
        <UserPen size={20} />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-4xl">{res?.data?.count}</CardTitle>
      </CardContent>
    </Card>
  );
}
