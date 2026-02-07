"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useOnboarding } from "@/lib/onboarding-context"
import { Check, Lock, ChevronDown } from "lucide-react"

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
  const { steps } = useOnboarding()

  const [expanded, setExpanded] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("widget-expanded")
      if (stored !== null) {
        setExpanded(stored === "true")
      }
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      localStorage.setItem("widget-expanded", String(expanded))
    }
  }, [expanded, hydrated])

  const completedCount = steps.filter((s) => s.completed).length
  const totalSteps = steps.length
  const progressValue = (completedCount / totalSteps) * 100

  const isStepLocked = (index: number): boolean => {
    for (let i = 0; i < index; i++) {
      if (!steps[i].completed) return true
    }
    return false
  }

  const currentStepId = steps.find((s, i) => !s.completed && !isStepLocked(i))?.id

  if (!hydrated) return null

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
    <Card className="fixed right-4 bottom-4 z-50 w-[360px] shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">Setup guide</CardTitle>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalSteps} steps completed
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setExpanded(false)}
        >
          <ChevronDown className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <Progress value={progressValue} className="h-1.5" />
        <div className="max-h-[480px] overflow-y-auto space-y-0.5">
          {steps.map((step, index) => {
            const locked = isStepLocked(index)
            const isActive = step.id === currentStepId

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                  isActive
                    ? "bg-accent font-medium"
                    : locked
                      ? "text-muted-foreground"
                      : ""
                }`}
              >
                <div className="flex size-5 shrink-0 items-center justify-center">
                  {step.completed ? (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                  ) : locked ? (
                    <Lock className="size-3.5 text-muted-foreground" />
                  ) : (
                    <div className="size-3.5 rounded-full border-2 border-muted-foreground/40" />
                  )}
                </div>
                <span>{step.title}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
