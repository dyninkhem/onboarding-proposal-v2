import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OnboardingProvider } from "@/lib/onboarding-context"
import { SetupGuideWidget } from "@/components/setup-guide-widget"
import { IntroModal } from "@/components/intro-modal/intro-modal"

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
      <IntroModal />
    </OnboardingProvider>
  )
}
