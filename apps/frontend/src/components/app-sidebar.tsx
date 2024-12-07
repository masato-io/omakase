"use client";

import * as React from "react";
import {
  Bot,
  Calculator,
  FileCheck,
  Import,
  Layers3,
  LayoutDashboard,
  List,
  Receipt,
  ReceiptText,
  Settings2,
  Ungroup,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "@/components/nav-header";
import { ModuleSwitcher } from "@/components/module-switcher";

const data = {
  navTop: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Agents",
      url: "#",
      icon: Bot,
    },
    {
      title: "Saved Views",
      url: "#",
      icon: Layers3,
    },
  ],
  navMain: [
    {
      title: "Procurements",
      url: "#",
      icon: Receipt,
      isActive: true,
      items: [
        {
          title: "Purchase Orders",
          url: "/procurements/purchase-orders",
        },
        {
          title: "Receipts",
          url: "/procurements/receipts",
        },
      ],
    },
    {
      title: "Manufacturing Orders",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "Standard",
          url: "/manufacturing-orders/standard",
        },
        {
          title: "Batch",
          url: "/manufacturing-orders/batch",
        },
      ],
    },
    {
      title: "Work Orders",
      url: "#",
      icon: FileCheck,
    },
    {
      title: "Bill of Materials",
      url: "#",
      icon: List,
    },
    {
      title: "Items",
      url: "#",
      icon: Ungroup,
    },
    {
      title: "Employees",
      url: "#",
      icon: Users,
    },
    {
      title: "Simulator",
      url: "#",
      icon: Calculator,
      items: [
        {
          title: "Input Requirement BOM",
          url: "#",
        },
        {
          title: "Output by Ingredients",
          url: "#",
        },
      ],
    },
  ],
  navSettings: [
    {
      title: "Unit of Measures",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Working Hours",
          url: "#",
        },
        {
          title: "Work Centers",
          url: "#",
        },
        {
          title: "Operations",
          url: "#",
        },
      ],
    },
    {
      title: "Import Inventory",
      url: "#",
      icon: Import,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Workspaces" items={data.navTop} />
        <NavMain title="Views" items={data.navMain} />
        <NavMain title="Settings" items={data.navSettings} />
      </SidebarContent>
      <SidebarFooter>
        <ModuleSwitcher
          modules={["Manufacturing Order"]}
          defaultModule={"Manufacturing Order"}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
