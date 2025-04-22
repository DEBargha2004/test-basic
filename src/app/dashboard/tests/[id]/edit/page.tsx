import { getRootTestInfo } from "@/actions/test";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CSR from "./_components/csr";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await getRootTestInfo(id);
  if (!res.success)
    return (
      <main className="flex justify-center items-center">
        <Alert variant={"destructive"}>
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{res.message}</AlertDescription>
        </Alert>
      </main>
    );

  return <CSR data={res.data!} />;
}
