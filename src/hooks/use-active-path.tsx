import { usePathname } from "next/navigation";

export const useActivePath = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/member/menu")) {
    return "menu";
  }
  if (pathname.startsWith("/member/order")) {
    return "orders";
  }
  if (pathname.startsWith("/member/profile")) {
    return "profile";
  }
  if (pathname === "/member" || pathname === "/dashboard") {
    return "home";
  }

  return "home";
};
