"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DepositSheet } from "@/components/deposit-sheet"
import { ConvertSheet } from "@/components/convert-sheet"
import { WithdrawalSheet } from "@/components/withdrawal-sheet"
import { AutomateSheet } from "@/components/automate-sheet"
import { useOnboarding } from "@/lib/onboarding-context"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

// Restricted actions that require onboarding completion
const GATED_ACTIONS = ["Deposit", "Convert", "Withdrawal", "Automate"]

interface NavActionItem {
  title: string
  url: string
  icon: LucideIcon
  items?: { title: string; url: string }[]
}

export function NavActions({
  items,
}: {
  items: NavActionItem[]
}) {
  const [depositOpen, setDepositOpen] = React.useState(false)
  const [convertOpen, setConvertOpen] = React.useState(false)
  const [withdrawalOpen, setWithdrawalOpen] = React.useState(false)
  const [automateOpen, setAutomateOpen] = React.useState(false)

  const { gateAction, isOnboardingComplete, navigateToOnboarding } = useOnboarding()

  const handleGatedAction = (title: string, openSheet: () => void) => {
    if (gateAction(title)) {
      openSheet()
    }
  }

  const getActionHandler = (title: string) => {
    switch (title) {
      case "Deposit":
        return () => handleGatedAction(title, () => setDepositOpen(true))
      case "Convert":
        return () => handleGatedAction(title, () => setConvertOpen(true))
      case "Withdrawal":
        return () => handleGatedAction(title, () => setWithdrawalOpen(true))
      case "Automate":
        return () => handleGatedAction(title, () => setAutomateOpen(true))
      default:
        return undefined
    }
  }

  const renderNavItem = (item: NavActionItem) => {
    const isGated = GATED_ACTIONS.includes(item.title)
    const isLocked = isGated && !isOnboardingComplete
    const handler = getActionHandler(item.title)
    const hasSubItems = item.items && item.items.length > 0

    // Items with sub-navigation (like Onboarding with Documents, etc.)
    if (hasSubItems) {
      return (
        <Collapsible key={item.title} asChild defaultOpen={item.title === "Onboarding"}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    // Gated action items (open sheets)
    if (handler) {
      const button = (
        <SidebarMenuButton tooltip={item.title} onClick={handler}>
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      )

      if (isLocked) {
        return (
          <SidebarMenuItem key={item.title}>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Complete onboarding to unlock</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        )
      }

      return <SidebarMenuItem key={item.title}>{button}</SidebarMenuItem>
    }

    // Regular link items
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild tooltip={item.title}>
          <Link href={item.url}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <TooltipProvider>
      <>
        <SidebarGroup>
          <SidebarGroupLabel>Orchestration</SidebarGroupLabel>
          <SidebarMenu>
            {items.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroup>

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        <ConvertSheet open={convertOpen} onOpenChange={setConvertOpen} />
        <WithdrawalSheet open={withdrawalOpen} onOpenChange={setWithdrawalOpen} />
        <AutomateSheet open={automateOpen} onOpenChange={setAutomateOpen} />
      </>
    </TooltipProvider>
  )
}
