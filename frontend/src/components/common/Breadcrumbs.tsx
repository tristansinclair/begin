"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const formatSegmentTitle = (segment: string, index: number) => {
    // Special handling for sessions
    if (index > 0 && segments[index - 1] === "sessions") {
      // Handle session IDs like "easy-3-mile-run", "upper-body-strength", etc.
      return segment
        .split("-")
        .map((word) => {
          // Keep numbers as is (like "3" in "3-mile-run")
          if (!isNaN(Number(word))) return word;
          // Capitalize other words
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }

    // Handle UUID-style IDs (show first 8 chars)
    if (segment.match(/^[a-f0-9]{8}-[a-f0-9]{4}-/)) {
      return `Session ${segment.slice(0, 8)}`;
    }

    // Default formatting for other segments
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const title = formatSegmentTitle(segment, index);

    return (
      <BreadcrumbItem key={segment}>
        {isLast ? (
          <BreadcrumbPage>{title}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={href}>{title}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 0 && <BreadcrumbSeparator />}
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}