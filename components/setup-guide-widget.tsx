"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOnboarding } from "@/lib/onboarding-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Check, ChevronDown, Clock, MoreHorizontal } from "lucide-react"

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
  const [expandedStep, setExpandedStep] = useState<string | undefined>(currentStepId)

  if (!hydrated) return null
  if (isWidgetDismissed) return null

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-primary px-3 py-2 shadow-lg transition-all duration-200 hover:opacity-90"
      >
        <span className="text-sm font-medium text-primary-foreground">
          {completedCount}/{totalSteps}
        </span>
      </button>
    )
  }

  return (
    <Card className={`fixed z-50 bg-white border border-border rounded-xl shadow-lg transition-all duration-200 ${
      isMobile
        ? "inset-x-0 bottom-0 w-full rounded-b-none"
        : "right-4 bottom-4 w-96"
    }`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">Setup guide</CardTitle>
          {isOnboardingComplete ? (
            <p className="text-sm font-medium text-primary">You&apos;re all set!</p>
          ) : (
            <p className="text-sm text-muted-foreground">
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
        <Progress value={progressValue} className="h-1" />
        <div className="max-h-[480px] overflow-y-auto">
          <Accordion
            type="single"
            collapsible
            value={expandedStep}
            onValueChange={setExpandedStep}
          >
            {steps.map((step) => {
              const isPassive = step.type === "passive"
              const isTerminal = step.type === "terminal"
              const isComplianceInProgress = isPassive && !step.completed

              return (
                <AccordionItem key={step.id} value={step.id} className="border-b-0 data-[state=open]:bg-muted/50 data-[state=open]:border-l-2 data-[state=open]:border-primary">
                  <AccordionTrigger className="hover:no-underline hover:bg-accent/30 px-4 py-2.5">
                    <div className="flex items-center gap-3">
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
                      <span className="text-sm">{step.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-3 px-4">
                    {isComplianceInProgress ? (
                      <div className="pl-8 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Under review — approx. 2–3 business days
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                          onClick={() => approveComplianceReview()}
                        >
                          (Demo: Approve)
                        </Button>
                      </div>
                    ) : isTerminal && !step.completed ? (
                      <div className="pl-8">
                        <p className="text-sm text-muted-foreground">
                          Your account will go live once compliance review is approved
                        </p>
                      </div>
                    ) : isTerminal && step.completed ? (
                      <div className="pl-8">
                        <p className="text-sm text-primary font-medium">Operations Live</p>
                      </div>
                    ) : (
                      <div className="pl-8 space-y-2">
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            navigateToOnboarding(step.id)
                            setExpanded(false)
                          }}
                        >
                          {step.completed ? "Review" : "Start"}
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
