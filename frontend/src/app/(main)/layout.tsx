import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar";
import { SessionBreadcrumbs } from "@/components/common/SessionBreadcrumbs";

export const metadata: Metadata = {
  title: "BEGIN",
  description: "Dashboard",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <SessionBreadcrumbs />
        </header>
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
