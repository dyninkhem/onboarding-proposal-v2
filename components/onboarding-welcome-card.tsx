"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useOnboarding } from "@/lib/onboarding-context"

export function OnboardingWelcomeCard() {
  const { steps, navigateToOnboarding } = useOnboarding()
  
  const completedSteps = steps.filter((s) => s.completed).length
  const totalSteps = steps.length
  const currentStep = steps.find((s) => !s.completed)
  
  // Calculate progress for SVG arc
  const progress = completedSteps / totalSteps
  const circumference = 2 * Math.PI * 6
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <Card className="border-0 bg-primary/5 px-4 py-2 gap-2">
      {/* Row 1: Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold">Welcome, Alex</h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            This is your Stablecoin Dashboard. Explore the demo view to see how mint, redeem, and treasury operations work—or continue onboarding to activate your account.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50"
            onClick={navigateToOnboarding}
          >
            Continue onboarding
          </Button>
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            Explore sandbox demo
          </Button>
        </div>
      </div>

      {/* Row 2: Progress Section */}
      <div className="flex flex-col gap-2 pt-2 border-t border-primary/10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          {/* Circular progress ring */}
          <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary/30"
            />
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary"
              transform="rotate(-90 8 8)"
            />
          </svg>
          <span className="text-sm font-medium">
            {completedSteps} of {totalSteps} steps completed
          </span>
        </div>
        
        {/* Vertical divider - hidden on mobile */}
        <div className="hidden sm:block h-4 w-px bg-border" />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs px-2.5 bg-background"
          onClick={navigateToOnboarding}
        >
          Todo: {currentStep ? currentStep.title : "Complete onboarding"}
          <ChevronRight className="ml-1 size-3" />
        </Button>
      </div>
    </Card>
  )
}
