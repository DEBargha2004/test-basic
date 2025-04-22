"use client";

import { TUsersTestAttempts } from "@/actions/attempt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatDuration, getAcronym } from "@/lib/utils";
import { EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CSR({
  defaultValue,
}: {
  defaultValue: TUsersTestAttempts[];
}) {
  const [attempts, setAttempts] = useState(defaultValue);

  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-4">ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Test</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt, i) => (
            <TableRow key={i}>
              <TableCell className="p-4 text-muted-foreground">
                {attempt.id}
              </TableCell>
              <TableCell className="flex justify-start items-center gap-2">
                <Avatar className="size-9">
                  <AvatarImage src={getImageUrl(attempt.user?.image ?? "")} />
                  <AvatarFallback>
                    {getAcronym(attempt.user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-sm font-medium">{attempt.user?.name}</h1>
                  <p className="text-muted-foreground text-xs">
                    {attempt.user?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>{attempt.title}</TableCell>
              <TableCell>
                {attempt.score?.marks ?? 0}/{attempt.totalMarks}
              </TableCell>
              <TableCell>
                {attempt.submittedAt
                  ? formatDuration(
                      (new Date(attempt.submittedAt)?.getTime() -
                        new Date(attempt.createdAt)?.getTime()) /
                        1000
                    )
                  : null}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="rounded-full cursor-pointer"
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/attempt/${attempt.id}/results`}>
                      <DropdownMenuItem>
                        <Eye />
                        <span>View</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
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
