import { getUsersTestAttempts } from "@/actions/attempt";
import Searchbar from "@/components/custom/searchbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AttemptsProvider from "@/providers/attempts-provider";
import AttemptsCSR from "../attempts/_components/attempts-csr";
import { QUERY_LIMIT } from "@/constants/query";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Number(page || 0);
  const resp = await getUsersTestAttempts({
    isUser: true,
    q: q || undefined,
    page: currentPage,
  });

  if (!resp.success) return <p>{resp.message}</p>;
  const minPage = 0;
  const maxPage = Math.floor(Number(resp.data?.[0]?.count ?? 0) / QUERY_LIMIT);

  const prevPage = Math.max(minPage, currentPage - 1);
  const nextPage = Math.min(maxPage, currentPage + 1);
  return (
    <main className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Attempts</CardTitle>
          <CardDescription>
            This is the list of attempts you have made
          </CardDescription>
        </CardHeader>
      </Card>
      <Searchbar placeholder="Search For Attempts" />
      <AttemptsProvider
        defaultValue={{ attempts: resp.data }}
        fetcherAction={getUsersTestAttempts}
        isUser
        prevPage={prevPage}
        nextPage={nextPage}
      >
        <AttemptsCSR />
      </AttemptsProvider>
    </main>
  );
}
