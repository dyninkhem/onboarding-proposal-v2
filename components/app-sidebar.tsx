"use client"

import type * as React from "react"
import {
  Home,
  Tag,
  Users,
  Code,
  ArrowLeftRight,
  Globe,
  FileText,
  Moon,
  ChevronsUpDown,
  ArrowDown,
  ArrowUp,
  Zap,
  Coins,
  ClipboardList,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavActions } from "@/components/nav-actions"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const data = {
  user: {
    name: "Wintermute Trading...",
    email: "email@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  entity: {
    name: "Global EU Entity Name...",
    id: "8533446d-1843-4b02-a0a3-79...",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        { title: "Dashboard A", url: "/dashboard/dashboard-a" },
        { title: "Dashboard B", url: "/dashboard/dashboard-b" },
        { title: "Transactions", url: "/dashboard/transactions" },
        { title: "Automations", url: "/dashboard/instructions" },
        { title: "Addresses", url: "/dashboard/addresses" },
        { title: "Fiat Accounts", url: "/dashboard/fiat-accounts" },
      ],
    },
    {
      title: "Onboarding",
      url: "/dashboard/onboarding",
      icon: ClipboardList,
      items: [
        { title: "Business Details", url: "/dashboard/onboarding" },
        { title: "Business Members", url: "/dashboard/onboarding/business" },
        { title: "Documents", url: "/dashboard/onboarding/documents" },
        { title: "Pricing and Fees", url: "/dashboard/onboarding/team" },
      ],
    },
    {
      title: "Stablecoin",
      url: "/dashboard/stablecoin",
      icon: Coins,
      items: [
        { title: "Issuance", url: "/dashboard/stablecoin/issuance" },
        { title: "Liquidity", url: "/dashboard/stablecoin/liquidity" },
        { title: "Movement", url: "/dashboard/stablecoin/movement" },
        { title: "Reserves", url: "/dashboard/stablecoin/reserves" },
      ],
    },
    {
      title: "Rewards 2.0",
      url: "/dashboard/rewards",
      icon: Tag,
    },
    {
      title: "Admin",
      url: "/dashboard/admin",
      icon: Users,
    },
    {
      title: "Developer",
      url: "/dashboard/developer",
      icon: Code,
    },
  ],
  navActions: [
    { title: "Convert", url: "/dashboard/convert", icon: ArrowLeftRight },
    { title: "Deposit", url: "/dashboard/deposit", icon: ArrowDown },
    { title: "Withdrawal", url: "/dashboard/withdrawal", icon: ArrowUp },
    { title: "Automate", url: "/dashboard/automate", icon: Zap },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: Globe },
    { title: "Documentation", url: "#", icon: FileText },
    { title: "Dark Mode", url: "#", icon: Moon, isToggle: true },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="/" className="flex items-center gap-2 px-2 py-1.5">
              <img src="/images/paxos-logo.png" alt="Paxos" height={32} style={{ height: 32, width: "auto" }} />
              <Badge className="bg-[#3b82f6] text-white text-xs px-2 py-0.5 rounded">Concept</Badge>
            </a>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium truncate max-w-[160px]">{data.entity.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[160px]">{data.entity.id}</span>
                  </div>
                  <ChevronsUpDown className="size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <DropdownMenuItem>Global EU Entity Name...</DropdownMenuItem>
                <DropdownMenuItem>US Entity</DropdownMenuItem>
                <DropdownMenuItem>APAC Entity</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavActions items={data.navActions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
