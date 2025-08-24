"use client";

// import { useState } from "react";
import DashboardSidebar from "@/components/admin/ui/sidebar";
import DashboardNavbar from "@/components/admin/ui/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-screen-3xl 3xl:container flex">
        <DashboardNavbar />
        <DashboardSidebar />
        <div className="h-screen w-full overflow-y-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </>
  );
}
