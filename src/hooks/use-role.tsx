import { getProfileUser } from "@/service/auth";
import { useEffect, useState } from "react";

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const user = await getProfileUser();
        const userRole = user.data?.profile.role;

        if (userRole === "admin") {
          setRole("admin");
        } else {
          setRole("cashier");
        }
      } catch (error) {
        console.error("gagal mendapatkan role", error);
        setRole(null);
      }
    };
    getUserRole();
  }, []);

  return role;
};
