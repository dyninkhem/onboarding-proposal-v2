"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOnboarding } from "@/lib/onboarding-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Check, ChevronDown, Clock, MoreHorizontal } from "lucide-react"

function ProgressRing({
  completed,
  total,
  size = 32,
  strokeWidth = 3,
}: {
  completed: number
  total: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? completed / total : 0
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted-foreground/20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="text-primary transition-all duration-200"
      />
    </svg>
  )
}

export function SetupGuideWidget() {
  const { steps, navigateToOnboarding, approveComplianceReview, isOnboardingComplete, isWidgetDismissed, setWidgetDismissed } = useOnboarding()
  const isMobile = useIsMobile()

  const [expanded, setExpanded] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("widget-expanded")
      if (stored !== null) {
        setExpanded(stored === "true")
      } else if (isMobile) {
        setExpanded(false)
      }
      setHydrated(true)
    }
  }, [isMobile])

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      localStorage.setItem("widget-expanded", String(expanded))
    }
  }, [expanded, hydrated])

  useEffect(() => {
    if (isOnboardingComplete && hydrated && !isWidgetDismissed) {
      autoDismissTimerRef.current = setTimeout(() => {
        setWidgetDismissed(true)
      }, 3000)
    }
    return () => {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current)
      }
    }
  }, [isOnboardingComplete, hydrated, isWidgetDismissed, setWidgetDismissed])

  const completedCount = steps.filter((s) => s.completed).length
  const totalSteps = steps.length
  const progressValue = (completedCount / totalSteps) * 100

  const currentStepId = steps.find((s) => !s.completed)?.id

  if (!hydrated) return null
  if (isWidgetDismissed) return null

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-primary px-3 py-2 shadow-lg transition-all duration-200 hover:opacity-90"
      >
        <ProgressRing completed={completedCount} total={totalSteps} size={28} strokeWidth={2.5} />
        <span className="text-sm font-medium text-primary-foreground">
          {completedCount}/{totalSteps}
        </span>
      </button>
    )
  }

  return (
    <Card className={`fixed z-50 shadow-lg transition-all duration-200 ${
      isMobile
        ? "inset-x-0 bottom-0 w-full rounded-b-none"
        : "right-4 bottom-4 w-[360px]"
    }`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">Setup guide</CardTitle>
          {isOnboardingComplete ? (
            <p className="text-xs font-medium text-primary">You&apos;re all set!</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalSteps} steps completed
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setWidgetDismissed(true)}>
                Dismiss setup guide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setExpanded(false)}
          >
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <Progress value={progressValue} className="h-1.5" />
        <div className="max-h-[480px] overflow-y-auto space-y-0.5">
          {steps.map((step) => {
            const isActive = step.id === currentStepId
            const isPassive = step.type === "passive"
            const isTerminal = step.type === "terminal"
            const isClickable =
              !isPassive && !(isTerminal && !step.completed)

            const isComplianceInProgress =
              isPassive && !step.completed

            const handleClick = () => {
              if (!isClickable) return
              navigateToOnboarding(step.id)
              setExpanded(false)
            }

            return (
              <div
                key={step.id}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    handleClick()
                  }
                }}
                className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                  isActive || isComplianceInProgress
                    ? "bg-accent font-medium"
                    : ""
                } ${
                  isClickable
                    ? "cursor-pointer hover:bg-accent/50"
                    : isComplianceInProgress || (isTerminal && !step.completed)
                      ? "cursor-not-allowed"
                      : ""
                }`}
              >
                <div className="flex size-5 shrink-0 items-center justify-center">
                  {step.completed ? (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                  ) : isComplianceInProgress ? (
                    <Clock className="size-4 text-amber-500" />
                  ) : (
                    <div className="size-3.5 rounded-full border-2 border-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span>{step.title}</span>
                  {isTerminal && step.completed && (
                    <div className="mt-0.5">
                      <span className="text-xs text-primary font-medium">Operations Live</span>
                    </div>
                  )}
                  {isComplianceInProgress && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        Under review — approx. 2–3 business days
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          approveComplianceReview()
                        }}
                      >
                        (Demo: Approve)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
