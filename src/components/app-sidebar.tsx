"use client";

import { NavMain } from "@/components/nav-main";
import { sidebarAdmin } from "@/constant/dashboard.menu.constant";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState<IUser>({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      const res = await getProfileUser();
      if (res.status && res.data) {
        setUserData({
          name: res.data.profile.name,
          email: res.data.auth.email,
          avatar: res.data.profile.avatar,
        });
      }
    };

    getUserData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarAdmin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
