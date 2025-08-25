"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toogle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-screen p-4">
            <div className="flex justify-between items-center mb-5">
              <SidebarTrigger />
              <ModeToggle />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
