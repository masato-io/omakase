"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Avatar from "boring-avatars";
import { ButtonIcon } from "@/components/ui/button-icon";
import { Plus, Search } from "lucide-react";

export function NavHeader({}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Avatar size={24} variant="marble" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Acme Inc</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ButtonIcon>
              <Search />
            </ButtonIcon>

            <ButtonIcon>
              <Plus />
            </ButtonIcon>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}