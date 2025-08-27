"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavMain {
  items: NavGroup[];
}

export function NavMain({ items }: NavMain) {
  const pathname = usePathname();

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    <a href={item.url} className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
