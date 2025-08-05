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
import { sampleWorkoutPlan } from "@/examples/sample-workout-plan";
import * as allSessions from "@/examples/sample-workout-sessions";

export function SessionBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const getBreadcrumbTitle = (segment: string, index: number): string => {
    // Check if we're in a session route and this is the session ID
    if (index > 0 && segments[index - 1] === "sessions") {
      // Look up the actual session name from the data
      const session = sampleWorkoutPlan.sessions.find(s => s.id === segment);
      if (session) {
        return session.name;
      }
      
      // Also check all exported sessions
      const allSessionsList = Object.values(allSessions).filter(
        item => item && typeof item === 'object' && 'id' in item && 'name' in item
      );
      const foundSession = allSessionsList.find((s: any) => s.id === segment);
      if (foundSession) {
        return foundSession.name;
      }
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
    const title = getBreadcrumbTitle(segment, index);

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