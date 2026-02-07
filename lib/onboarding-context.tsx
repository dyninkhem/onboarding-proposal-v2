"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export interface OnboardingStep {
  id: string
  title: string
  completed: boolean
  hasForm?: boolean
}

const defaultSteps: OnboardingStep[] = [
  { id: "business-information", title: "Business Information", completed: false, hasForm: true },
  { id: "address", title: "Address", completed: false, hasForm: true },
  { id: "compliance-transaction", title: "Compliance & Transaction Details", completed: false, hasForm: true },
]

interface OnboardingContextValue {
  steps: OnboardingStep[]
  setSteps: React.Dispatch<React.SetStateAction<OnboardingStep[]>>
  currentStepId: string | null
  setCurrentStepId: React.Dispatch<React.SetStateAction<string | null>>
  isOnboardingComplete: boolean
  /** Navigate to the onboarding page, optionally at a specific step */
  navigateToOnboarding: (stepId?: string) => void
  /** Call this before a restricted action. Returns true if action allowed, false if blocked. */
  gateAction: (actionName: string) => boolean
  /** Mark a step as complete and advance to the next */
  completeStep: (stepId: string) => void
  /** Go back to a previous step */
  goBackToStep: (stepId: string) => void
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
  /** For demo purposes, set initial completion state */
  initiallyComplete?: boolean
}

export function OnboardingProvider({ children, initiallyComplete = false }: OnboardingProviderProps) {
  const router = useRouter()
  const [steps, setSteps] = React.useState<OnboardingStep[]>(() =>
    initiallyComplete
      ? defaultSteps.map((s) => ({ ...s, completed: true }))
      : defaultSteps
  )
  const [currentStepId, setCurrentStepId] = React.useState<string | null>(
    initiallyComplete ? null : "business-information"
  )

  const isOnboardingComplete = React.useMemo(
    () => steps.every((s) => s.completed),
    [steps]
  )

  const navigateToOnboarding = React.useCallback((stepId?: string) => {
    // Determine which step to navigate to
    let targetStepId = stepId
    if (!targetStepId) {
      // Find first incomplete step
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
        return true // Action allowed
      }
      // Block action and navigate to onboarding
      navigateToOnboarding()
      return false // Action blocked
    },
    [isOnboardingComplete, navigateToOnboarding]
  )

  const completeStep = React.useCallback((stepId: string) => {
    setSteps((prev) => {
      const updated = prev.map((s) =>
        s.id === stepId ? { ...s, completed: true } : s
      )
      // Find next incomplete step
      const currentIndex = prev.findIndex((s) => s.id === stepId)
      const nextIncomplete = updated.find((s, i) => i > currentIndex && !s.completed)
      setCurrentStepId(nextIncomplete?.id ?? null)
      return updated
    })
  }, [])

  const goBackToStep = React.useCallback((stepId: string) => {
    setSteps((prev) => {
      const stepIndex = prev.findIndex((s) => s.id === stepId)
      if (stepIndex === -1) return prev
      // Mark the target step and all subsequent steps as incomplete
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
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}
