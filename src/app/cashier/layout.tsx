import AdminLayout from "@/layout/admin-layout";

export default function LayoutCashier({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
