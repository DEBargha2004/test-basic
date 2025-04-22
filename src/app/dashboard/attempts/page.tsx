import { getUsersTestAttempts } from "@/actions/attempt";
import Searchbar from "@/components/custom/searchbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CSR from "./_components/csr";

export default async function Page() {
  const res = await getUsersTestAttempts();

  if (!res.success) return <p>{res.message}</p>;

  return (
    <main className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attempts</CardTitle>
          <CardDescription>
            This is the list of attempts users have made in your tests
          </CardDescription>
        </CardHeader>
      </Card>
      <Searchbar placeholder="Search For Attempts" />
      <CSR defaultValue={res.data ?? []} />
    </main>
  );
}
