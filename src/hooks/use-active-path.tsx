import { usePathname } from "next/navigation";

export const useActivePath = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/member") || pathname === "/dashboard") {
    return "home";
  }
  if (pathname.startsWith("/menu")) {
    return "menu";
  }
  if (pathname.startsWith("/orders")) {
    return "orders";
  }
  if (pathname.startsWith("/profile")) {
    return "profile";
  }

  return "home";
};
