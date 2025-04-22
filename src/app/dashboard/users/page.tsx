import { getAttempters } from "@/actions/user";
import Searchbar from "@/components/custom/searchbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CSR from "./_components/csr";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParamsValue = await searchParams;

  const query = searchParamsValue.q ?? "";

  const res = await getAttempters({ query });

  if (!res.success) return <p>{res.message}</p>;

  return (
    <main className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            These are the list of users who had attempted your tests
          </CardDescription>
        </CardHeader>
      </Card>
      <Searchbar placeholder="Search For Users" />
      <CSR defaultValue={res.data ?? []} />
    </main>
  );
}
