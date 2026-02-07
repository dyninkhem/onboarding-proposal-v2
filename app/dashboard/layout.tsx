import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OnboardingProvider } from "@/lib/onboarding-context"
import { SetupGuideWidget } from "@/components/setup-guide-widget"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <SetupGuideWidget />
    </OnboardingProvider>
  )
}
