import MemberLayout from "@/layout/member-layout";

export default function LayoutMember({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MemberLayout>{children}</MemberLayout>;
}
