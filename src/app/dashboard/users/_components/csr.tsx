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
import { getImageUrl } from "@/lib/url";
import { getAcronym } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CSR({ defaultValue }: { defaultValue: TAttempter[] }) {
  const [attempters, setAttempters] = useState(defaultValue);
  const [query, setQuery] = useQueryState("q");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    getAttempters({ query: debouncedQuery ?? "" }).then((res) => {
      if (!res.success) return toast.error(res.message);

      setAttempters(res.data ?? []);
    });
  }, [debouncedQuery]);

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
              <TableCell className="font-semibold">{attempter.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {attempter.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter className="p-4 border-t">
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
