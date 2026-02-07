"use client"

import * as React from "react"
import { Plus, Coins } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { IssuanceSheet } from "@/components/issuance-sheet"

export default function IssuancePage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/stablecoin">Stablecoin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Issuance</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Stablecoin Issuance</h1>
            <p className="text-muted-foreground">Create and manage your branded stablecoins</p>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <Plus className="size-4" />
            Create Stablecoin
          </Button>
        </div>

        {/* Empty state */}
        <Card className="flex flex-col items-center justify-center py-16">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Coins className="size-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg mb-2">No stablecoins yet</CardTitle>
          <CardDescription className="text-center max-w-md mb-6">
            Create your first branded stablecoin backed by Paxos reserves. Get started in minutes.
          </CardDescription>
          <Button onClick={() => setIsSheetOpen(true)}>
            <Plus className="size-4" />
            Create Stablecoin
          </Button>
        </Card>
      </div>

      <IssuanceSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  )
}
