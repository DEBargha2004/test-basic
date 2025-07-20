import { getYourTestsCount } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotebookPen } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function Page() {
  const res = await getYourTestsCount();
  return (
    <Card>
      <CardHeader className="space-y-0 flex flex-row justify-between">
        <CardTitle>Your Tests</CardTitle>
        <NotebookPen size={20} />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-4xl">{res.data?.count}</CardTitle>
      </CardContent>
    </Card>
  );
}
