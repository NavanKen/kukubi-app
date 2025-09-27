import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toogle";
import DashboardBreadcrumb from "@/components/dashboard-breadcrumb";

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
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <DashboardBreadcrumb />
              </div>
              <ModeToggle />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
