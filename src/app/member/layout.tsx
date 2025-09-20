import AppBar from "@/components/member/ui/app-bar";
import BottomNavigation from "@/components/member/ui/bottom-bar";

export default function UserMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen bg-white p-7">
        <AppBar />
        <div className="pt-16">{children}</div>
        <BottomNavigation />
      </div>
    </>
  );
}
