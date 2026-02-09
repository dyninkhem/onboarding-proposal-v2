"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { STEPS, type OnboardingStepConfig } from "./onboarding-steps"

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  hasForm?: boolean
  type: "action" | "passive" | "terminal" | "completed"
  section?: "onboarding" | "activation"
}

function buildSteps(
  configs: OnboardingStepConfig[],
  progress: Record<string, boolean>
): OnboardingStep[] {
  return configs.map((cfg) => ({
    id: cfg.id,
    title: cfg.title,
    description: cfg.description,
    completed: cfg.type === "completed" ? true : !!progress[cfg.id],
    hasForm: cfg.type === "action",
    type: cfg.type,
    section: cfg.section,
  }))
}

interface OnboardingContextValue {
  steps: OnboardingStep[]
  setSteps: React.Dispatch<React.SetStateAction<OnboardingStep[]>>
  currentStepId: string | null
  setCurrentStepId: React.Dispatch<React.SetStateAction<string | null>>
  isOnboardingComplete: boolean
  navigateToOnboarding: (stepId?: string) => void
  gateAction: (actionName: string) => boolean
  completeStep: (stepId: string) => void
  goBackToStep: (stepId: string) => void
  approveComplianceReview: () => void
  isWidgetDismissed: boolean
  setWidgetDismissed: (dismissed: boolean) => void
}

const OnboardingContext = React.createContext<OnboardingContextValue | null>(null)

export function useOnboarding() {
  const context = React.useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

interface OnboardingProviderProps {
  children: React.ReactNode
  initiallyComplete?: boolean
}

const WIDGET_DISMISSED_KEY = "widget-dismissed"

export function OnboardingProvider({ children, initiallyComplete = false }: OnboardingProviderProps) {
  const router = useRouter()

  const [steps, setSteps] = React.useState<OnboardingStep[]>(() => {
    const defaultProgress: Record<string, boolean> = {}
    for (const cfg of STEPS) {
      defaultProgress[cfg.id] = !!initiallyComplete
    }
    return buildSteps(STEPS, defaultProgress)
  })

  const [currentStepId, setCurrentStepId] = React.useState<string | null>(
    initiallyComplete ? null : (STEPS.find((s) => s.type !== "completed")?.id ?? null)
  )

  const [isWidgetDismissed, setWidgetDismissedState] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const dismissed = localStorage.getItem(WIDGET_DISMISSED_KEY) === "true"
    setWidgetDismissedState(dismissed)
  }, [initiallyComplete])

  const setWidgetDismissed = React.useCallback((dismissed: boolean) => {
    setWidgetDismissedState(dismissed)
    if (typeof window !== "undefined") {
      localStorage.setItem(WIDGET_DISMISSED_KEY, String(dismissed))
    }
  }, [])

  const isOnboardingComplete = React.useMemo(
    () => steps.every((s) => s.completed),
    [steps]
  )

  const navigateToOnboarding = React.useCallback((stepId?: string) => {
    let targetStepId = stepId
    if (!targetStepId) {
      const firstIncomplete = steps.find((s) => !s.completed)
      targetStepId = firstIncomplete?.id
    }

    if (targetStepId) {
      router.push(`/dashboard/onboarding?step=${targetStepId}`)
    } else {
      router.push("/dashboard/onboarding")
    }
  }, [steps, router])

  const gateAction = React.useCallback(
    (actionName: string): boolean => {
      if (isOnboardingComplete) {
        return true
      }
      navigateToOnboarding()
      return false
    },
    [isOnboardingComplete, navigateToOnboarding]
  )

  const completeStep = React.useCallback((stepId: string) => {
    setSteps((prev) => {
      const step = prev.find((s) => s.id === stepId)
      if (!step) return prev
      if (step.type === "passive" || step.type === "completed") return prev

      const updated = prev.map((s) =>
        s.id === stepId ? { ...s, completed: true } : s
      )
      const currentIndex = prev.findIndex((s) => s.id === stepId)
      const nextIncomplete = updated.find((s, i) => i > currentIndex && !s.completed && s.type !== "completed")
      setCurrentStepId(nextIncomplete?.id ?? null)
      return updated
    })
  }, [])

  const approveComplianceReview = React.useCallback(() => {
    setSteps((prev) => {
      const updated = prev.map((s) => {
        if (s.id === "review-go-live") return { ...s, completed: true }
        return s
      })
      const firstIncomplete = updated.find((s) => !s.completed && s.type !== "completed")
      setCurrentStepId(firstIncomplete?.id ?? null)
      return updated
    })
  }, [])

  const goBackToStep = React.useCallback((stepId: string) => {
    setSteps((prev) => {
      const stepIndex = prev.findIndex((s) => s.id === stepId)
      if (stepIndex === -1) return prev
      return prev.map((s, i) =>
        i >= stepIndex ? { ...s, completed: false } : s
      )
    })
    setCurrentStepId(stepId)
  }, [])

  const value: OnboardingContextValue = {
    steps,
    setSteps,
    currentStepId,
    setCurrentStepId,
    isOnboardingComplete,
    navigateToOnboarding,
    gateAction,
    completeStep,
    goBackToStep,
    approveComplianceReview,
    isWidgetDismissed,
    setWidgetDismissed,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}
