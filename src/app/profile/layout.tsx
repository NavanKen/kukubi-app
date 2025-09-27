import AdminLayout from "@/layout/admin-layout";

export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
