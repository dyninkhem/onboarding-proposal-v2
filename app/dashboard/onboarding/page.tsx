"use client"

import { useSearchParams } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding-wizard"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const stepId = searchParams.get("step")

  return <OnboardingWizard initialStepId={stepId} />
}
