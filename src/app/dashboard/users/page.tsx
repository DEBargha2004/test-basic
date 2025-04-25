import { getAttempters } from "@/actions/user";
import Searchbar from "@/components/custom/searchbar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CSR from "./_components/csr";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { QUERY_LIMIT } from "@/constants/query";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { query, page } = await searchParams;

  const currentPage = Number(page || 0);

  const res = await getAttempters({
    query: query || undefined,
    page: currentPage,
  });

  if (!res.success) return <p>{res.message}</p>;

  const minPage = 0;
  const maxPage = Math.floor(Number(res.data?.[0]?.count ?? 0) / QUERY_LIMIT);

  const prevPage = Math.max(minPage, currentPage - 1);
  const nextPage = Math.min(maxPage, currentPage + 1);

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

      <CSR
        defaultValue={res.data ?? []}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </main>
  );
}
