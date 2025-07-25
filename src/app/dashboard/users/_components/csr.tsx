"use client";

import { getAttempters, TAttempter } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_LIMIT } from "@/constants/query";
import { getImageUrl } from "@/lib/url";
import { getAcronym } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CSR({
  defaultValue,
  nextPage,
  prevPage,
}: {
  defaultValue: TAttempter[];
  prevPage: number;
  nextPage: number;
}) {
  const [attempters, setAttempters] = useState(defaultValue);
  const [query] = useQueryState("q");
  const [page] = useQueryState("page");
  const debouncedQuery = useDebounce(query, 500);
  const [{ prev, next }, setPage] = useState({
    prev: prevPage,
    next: nextPage,
  });

  const currentPageNum = Number(page || 0);
  const entryStarting =
    QUERY_LIMIT * currentPageNum + (attempters.length ? 1 : 0);
  const entryEnding = QUERY_LIMIT * currentPageNum + attempters.length;

  useEffect(() => {
    getAttempters({ query: debouncedQuery ?? "" }).then((res) => {
      if (!res.success) return toast.error(res.message);
      setAttempters(res.data ?? []);
      const minPage = 0;
      const maxPage = Math.floor(
        Number(res.data?.[0]?.count ?? 0) / QUERY_LIMIT
      );

      const prevPage = Math.max(minPage, currentPageNum - 1);
      const nextPage = Math.min(maxPage, currentPageNum + 1);
      setPage({ prev: prevPage, next: nextPage });
    });
  }, [debouncedQuery, currentPageNum]);

  return (
    <Card className="p-0 gap-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="py-5">Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempters.map((attempter, i) => (
            <TableRow key={i}>
              <TableCell className="flex justify-center py-3">
                <Avatar>
                  <AvatarImage src={getImageUrl(attempter.image ?? "")} />
                  <AvatarFallback>
                    {getAcronym(attempter.name ?? "")}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-semibold text-lg">
                {attempter.name}
              </TableCell>
              <TableCell className="text-muted-foreground text-lg">
                {attempter.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter className="p-4 border-t">
        <Pagination className="flex justify-between">
          <p className="text-sm">
            showing {entryStarting} - {entryEnding} of {attempters?.[0]?.count}{" "}
            records
          </p>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?q=${query}&page=${prev}`} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`?q=${query}&page=${next}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
