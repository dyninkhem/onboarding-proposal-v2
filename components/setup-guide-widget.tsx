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
import { Check, ChevronDown, Clock, Maximize2, MoreHorizontal } from "lucide-react"

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
    const nextActionStep = steps.find((s) => !s.completed && s.type === "action")
    const nextStep = nextActionStep ?? steps.find((s) => !s.completed)

    return (
      <Card
        onClick={() => setExpanded(true)}
        className={`fixed z-50 cursor-pointer bg-card border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-200 ${
          isMobile
            ? "inset-x-0 bottom-0 w-full rounded-b-none"
            : "right-4 bottom-4 w-80"
        }`}
      >
        <CardContent className="px-2.5 py-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Setup guide</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(true)
              }}
            >
              <Maximize2 className="size-4" />
            </Button>
          </div>
          <Progress value={progressValue} className="h-1" />
          <div className="text-sm">
            {isOnboardingComplete ? (
              <span className="text-primary font-medium">All steps complete</span>
            ) : nextStep ? (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Next:</span>
                {nextActionStep ? (
                  <button
                    className="text-primary font-medium hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateToOnboarding(nextStep.id)
                    }}
                  >
                    {nextStep.title}
                  </button>
                ) : (
                  <span className="text-primary font-medium">{nextStep.title}</span>
                )}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`fixed z-50 bg-card border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-200 ${
      isMobile
        ? "inset-x-0 bottom-0 w-full rounded-b-none"
        : "right-4 bottom-4 w-80"
    }`}>
      <CardHeader className="flex flex-row items-center justify-between px-3 pt-1.5 pb-0">
        <div className="space-y-0.5">
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
      <CardContent className="space-y-1 px-3 pb-1">
        <Progress value={progressValue} className="h-1" />
        <div className="max-h-[480px] overflow-y-auto">
          {/* Onboarding section */}
          <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Onboarding
          </p>
          <Accordion
            type="single"
            collapsible
            value={expandedStep}
            onValueChange={setExpandedStep}
          >
            {steps.filter((s) => s.section === "onboarding").map((step) => {
              const isCompleted = step.type === "completed"

              return (
                <AccordionItem key={step.id} value={step.id} className="border-b-0 data-[state=open]:bg-muted/50 data-[state=open]:border-l-2 data-[state=open]:border-primary">
                  <AccordionTrigger className="hover:no-underline hover:bg-accent/30 px-2.5 py-1">
                    <div className="flex items-center gap-2">
                      <div className="flex size-4 shrink-0 items-center justify-center">
                        {step.completed ? (
                          <div className="flex size-4 items-center justify-center rounded-full bg-primary">
                            <Check className="size-2.5 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="size-3.5 rounded-full border-2 border-muted-foreground/40" />
                        )}
                      </div>
                      <span className={`text-sm ${isCompleted ? "text-muted-foreground" : ""}`}>{step.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0.5 pb-1 px-2.5">
                    <div className="pl-6 space-y-1.5">
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {!isCompleted && (
                        <Button
                          size="sm"
                          onClick={() => {
                            navigateToOnboarding(step.id)
                            setExpanded(false)
                          }}
                        >
                          {step.completed ? "Review" : "Start"}
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {/* Activation section */}
          <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Activation
          </p>
          <Accordion
            type="single"
            collapsible
            value={expandedStep}
            onValueChange={(v) => setExpandedStep(v)}
          >
            {steps.filter((s) => s.section === "activation").map((step) => {
              const isReviewGoLive = step.id === "review-go-live"
              const isReviewInProgress = isReviewGoLive && !step.completed

              return (
                <AccordionItem key={step.id} value={step.id} className="border-b-0 data-[state=open]:bg-muted/50 data-[state=open]:border-l-2 data-[state=open]:border-primary">
                  <AccordionTrigger className="hover:no-underline hover:bg-accent/30 px-2.5 py-1">
                    <div className="flex items-center gap-2">
                      <div className="flex size-4 shrink-0 items-center justify-center">
                        {step.completed ? (
                          <div className="flex size-4 items-center justify-center rounded-full bg-primary">
                            <Check className="size-2.5 text-primary-foreground" />
                          </div>
                        ) : isReviewInProgress ? (
                          <Clock className="size-4 text-amber-500" />
                        ) : (
                          <div className="size-3.5 rounded-full border-2 border-muted-foreground/40" />
                        )}
                      </div>
                      <span className="text-sm">{step.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0.5 pb-1 px-2.5">
                    {isReviewInProgress ? (
                      <div className="pl-6 space-y-1.5">
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
                    ) : isReviewGoLive && step.completed ? (
                      <div className="pl-6">
                        <p className="text-sm text-primary font-medium">Operations Live</p>
                      </div>
                    ) : (
                      <div className="pl-6 space-y-1.5">
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
