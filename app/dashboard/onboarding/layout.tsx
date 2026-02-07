"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, ClipboardList, FileText, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const onboardingNav = [
  {
    title: "Business Details",
    href: "/dashboard/onboarding",
    icon: ClipboardList,
  },
  {
    title: "Business Members",
    href: "/dashboard/onboarding/business",
    icon: Building2,
  },
  {
    title: "Documents",
    href: "/dashboard/onboarding/documents",
    icon: FileText,
  },
  {
    title: "Pricing and Fees",
    href: "/dashboard/onboarding/team",
    icon: Users,
  },
]

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Onboarding</h1>
            <p className="text-xs text-muted-foreground">Complete your account setup to unlock all features</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex gap-1 border-b border-border bg-background px-6">
        {onboardingNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              )}
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-muted">
        {children}
      </div>
    </div>
  )
}
