"use client";

import { NavMain } from "@/components/nav-main";
import {
  sidebarAdmin,
  sidebarCashier,
} from "@/constant/dashboard.menu.constant";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { getProfileUser } from "@/service/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { IUser } from "@/types/auth.type";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState<IUser>({
    userId: "",
    name: "",
    email: "",
    avatar: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserData = async () => {
      const res = await getProfileUser();
      if (res.status && res.data) {
        setUserData({
          userId: res.data.profile.id,
          name: res.data.profile.name,
          email: res.data.auth.email,
          avatar: res.data.profile.avatar,
          role: res.data.profile.role,
        });
      }
      setIsLoading(false);
    };

    getUserData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="px-4 py-7 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-sm" />
              <div className="bg-muted/10 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-20 rounded-sm" />
                </div>
              </div>
            </div>

            {[1, 2, 2].map((itemCount, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-14 rounded-sm opacity-50" />
                {Array.from({ length: itemCount }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-2.5 rounded-md"
                  >
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton
                      className={`h-4 rounded-sm ${i === 0 ? "w-20" : "w-28"}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <NavMain
            items={userData.role === "admin" ? sidebarAdmin : sidebarCashier}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? <NavUser isLoading /> : <NavUser user={userData} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
