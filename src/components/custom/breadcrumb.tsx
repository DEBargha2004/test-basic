"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export default function BreadCrumbGenerator() {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((l) => l !== "");

  const generateFullLink = (index: number) => {
    return "/" + pathArray.slice(0, index + 1).join("/");
  };

  function uppercaseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathArray.map((path, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={generateFullLink(index)}>
                {uppercaseFirstLetter(path)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
