import { getTestsOfUser } from "@/actions/test";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CSRenderer from "./_components/csr";
import DashboardTestsProvider from "@/providers/dashboard-tests-provider";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsValue = await searchParams;
  const status = searchParamsValue.status ?? "all";
  const query = searchParamsValue.q ?? "";

  const resp = await getTestsOfUser({
    q: query as string,
    status: status as string,
  });

  if (!resp.success)
    return (
      <main className="grid h-full place-content-center">
        <Alert>
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{resp.message}</AlertDescription>
        </Alert>
      </main>
    );

  return (
    <main className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 gap-4">
      <DashboardTestsProvider defaultTests={resp.data ?? []}>
        <CSRenderer />
      </DashboardTestsProvider>
    </main>
  );
}
