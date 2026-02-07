"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, ChevronUp, Mail, MessageCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface OnboardingStep {
  id: string
  title: string
  completed: boolean
  hasForm?: boolean
}

const initialSteps: OnboardingStep[] = [
  {
    id: "business-information",
    title: "Business Information",
    completed: false,
    hasForm: true,
  },
  {
    id: "address",
    title: "Address",
    completed: false,
    hasForm: true,
  },
  {
    id: "compliance-transaction",
    title: "Compliance & Transaction Details",
    completed: false,
    hasForm: true,
  },
]

interface TimelineSubStep {
  label: string
  status: "completed" | "active" | "pending"
}

interface TimelineItem {
  label: string
  description?: string
  status: "completed" | "active" | "pending"
  substeps?: TimelineSubStep[]
  expandable?: boolean
}

const timeline: TimelineItem[] = [
  {
    label: "Business Details",
    status: "active",
    expandable: true,
    substeps: [
      { label: "Business Information", status: "completed" },
      { label: "Address", status: "completed" },
      { label: "Compliance & Transaction Details", status: "active" },
    ],
  },
  { label: "Business Members", status: "pending" },
  { label: "Documents", status: "pending" },
  { label: "Pricing and Fees", status: "pending" },
  { label: "Compliance Review", description: "Approx. 2–3 business days", status: "pending" },
  { label: "Operations Live", status: "pending" },
]

interface OnboardingWizardProps {
  /** Optionally jump to a specific step when mounting */
  initialStepId?: string | null
}

export function OnboardingWizard({ initialStepId }: OnboardingWizardProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps)
  const [expandedStep, setExpandedStep] = useState<string | null>("business-details")
  const [sameAddress, setSameAddress] = useState(false)
  const [expandedTimelineItems, setExpandedTimelineItems] = useState<Set<string>>(
    new Set(["Business Details"])
  )

  // When initialStepId changes, expand that step (if it's incomplete)
  useEffect(() => {
    if (initialStepId) {
      const step = steps.find((s) => s.id === initialStepId)
      if (step && !step.completed) {
        setExpandedStep(initialStepId)
      } else {
        // If specified step is complete, find first incomplete
        const firstIncomplete = steps.find((s) => !s.completed)
        if (firstIncomplete) {
          setExpandedStep(firstIncomplete.id)
        }
      }
    }
  }, [initialStepId, steps])

  const completedCount = steps.filter((s) => s.completed).length
  const totalCount = steps.length

  const toggleStep = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId)
    if (step?.completed) return
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const completeStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed: true } : s))
    )
    const currentIndex = steps.findIndex((s) => s.id === stepId)
    const nextIncomplete = steps.find((s, i) => i > currentIndex && !s.completed)
    setExpandedStep(nextIncomplete?.id ?? null)
  }

  const goBack = (stepId: string) => {
    const currentIndex = steps.findIndex((s) => s.id === stepId)
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1]
      setSteps((prev) =>
        prev.map((s) => (s.id === prevStep.id ? { ...s, completed: false } : s))
      )
      setExpandedStep(prevStep.id)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-4xl mx-auto">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Acme Corp
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            You're nearly ready to transact
          </h1>
          <p className="text-sm text-muted-foreground">
            To activate your stablecoin operations, complete the steps below:
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isExpanded = expandedStep === step.id
            const isClickable = !step.completed && step.hasForm

            return (
              <div key={step.id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className={cn(
                    "flex w-full items-center gap-3 py-4 text-left transition-colors",
                    "cursor-pointer hover:bg-muted/50"
                  )}
                >
                  {/* Step Indicator */}
                  {step.completed ? (
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                  )}

                  {/* Step Title */}
                  <span
                    className={cn(
                      "flex-1 text-sm font-medium",
                      step.completed ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {step.title}
                  </span>

                  {/* Expand Icon */}
                  <span className="text-muted-foreground">
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </span>
                </button>

                {/* Section 1: Business Information */}
                {isExpanded && step.id === "business-information" && (
                  <div className="pb-6 pl-9 pr-4 space-y-6">
                    <div className="space-y-4">
                      
                      <div className="space-y-2">
                        <Label htmlFor="institution-type">Institution Type <span className="text-destructive">*</span></Label>
                        <Select defaultValue="corporation">
                          <SelectTrigger id="institution-type" className="bg-card">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="non-profit">Non-Profit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="incorporation-id-type">Incorporation ID Type <span className="text-destructive">*</span></Label>
                          <Select defaultValue="registration">
                            <SelectTrigger id="incorporation-id-type" className="bg-card">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="registration">Registration Number</SelectItem>
                              <SelectItem value="ein">EIN</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="incorporation-id">Incorporation ID Number <span className="text-destructive">*</span></Label>
                          <Input id="incorporation-id" placeholder="123456789" className="bg-card" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-website">Business Website</Label>
                        <Input id="business-website" placeholder="https://www.example.com" className="bg-card" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-description">Description of Business</Label>
                        <Textarea 
                          id="business-description" 
                          placeholder="e.g. We are a fintech platform for SMBs and plan to use Paxos APIs to offer crypto buying and selling."
                          rows={3}
                          className="bg-card"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry-sector">Industry Sector <span className="text-destructive">*</span></Label>
                        <Select>
                          <SelectTrigger id="industry-sector" className="bg-card">
                            <SelectValue placeholder="-- Select an option --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fintech">Financial Technology</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Button variant="outline" onClick={() => goBack(step.id)} disabled={index === 0}>
                        Back
                      </Button>
                      <Button variant="outline">Save for later</Button>
                      <Button onClick={() => completeStep(step.id)}>Next</Button>
                    </div>
                  </div>
                )}

                {/* Section 2: Address */}
                {isExpanded && step.id === "address" && (
                  <div className="pb-6 pl-9 pr-4 space-y-6">
                    <div className="space-y-4">
                      <p className="text-xs font-medium text-muted-foreground">Incorporation Address</p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inc-country">Country <span className="text-destructive">*</span></Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="inc-country" className="bg-card">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inc-address1">Address Line 1 <span className="text-destructive">*</span></Label>
                        <Input id="inc-address1" placeholder="Street address" className="bg-card" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inc-address2">Address Line 2</Label>
                        <Input id="inc-address2" placeholder="Apt, suite, etc." className="bg-card" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="inc-city">City <span className="text-destructive">*</span></Label>
                          <Input id="inc-city" placeholder="City" className="bg-card" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="inc-state">State / Province <span className="text-destructive">*</span></Label>
                          <Select>
                            <SelectTrigger id="inc-state" className="bg-card">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="inc-zip">Zip Code <span className="text-destructive">*</span></Label>
                          <Input id="inc-zip" placeholder="Zip code" className="bg-card" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                          id="same-address" 
                          checked={sameAddress}
                          onCheckedChange={(checked) => setSameAddress(checked === true)}
                        />
                        <Label htmlFor="same-address" className="text-sm font-normal">
                          Business operating address is the same as incorporation address
                        </Label>
                      </div>

                      {!sameAddress && (
                        <div className="space-y-4 pt-4">
                          <p className="text-xs font-medium text-muted-foreground">Business Operating Address</p>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bus-country">Country <span className="text-destructive">*</span></Label>
                            <Select defaultValue="us">
                              <SelectTrigger id="bus-country" className="bg-card">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bus-address1">Address Line 1 <span className="text-destructive">*</span></Label>
                            <Input id="bus-address1" placeholder="Street address" className="bg-card" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bus-address2">Address Line 2</Label>
                            <Input id="bus-address2" placeholder="Apt, suite, etc." className="bg-card" />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor="bus-city">City <span className="text-destructive">*</span></Label>
                              <Input id="bus-city" placeholder="City" className="bg-card" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="bus-state">State / Province <span className="text-destructive">*</span></Label>
                              <Select>
                                <SelectTrigger id="bus-state" className="bg-card">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ny">New York</SelectItem>
                                  <SelectItem value="ca">California</SelectItem>
                                  <SelectItem value="tx">Texas</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="bus-zip">Zip Code <span className="text-destructive">*</span></Label>
                              <Input id="bus-zip" placeholder="Zip code" className="bg-card" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Button variant="outline" onClick={() => goBack(step.id)} disabled={index === 0}>
                        Back
                      </Button>
                      <Button variant="outline">Save for later</Button>
                      <Button onClick={() => completeStep(step.id)}>Next</Button>
                    </div>
                  </div>
                )}

                {/* Section 3: Compliance & Transaction Details */}
                {isExpanded && step.id === "compliance-transaction" && (
                  <div className="pb-6 pl-9 pr-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>
                          Does your business engage in money transmission?
                          <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup defaultValue="no">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="money-transmission-yes-ct" />
                            <Label htmlFor="money-transmission-yes-ct" className="font-normal cursor-pointer">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="money-transmission-no-ct" />
                            <Label htmlFor="money-transmission-no-ct" className="font-normal cursor-pointer">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthly-volume-ct">Anticipated Monthly Volume</Label>
                        <Select>
                          <SelectTrigger id="monthly-volume-ct" className="bg-card">
                            <SelectValue placeholder="-- Select an option --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-100k">$0 - $100,000</SelectItem>
                            <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                            <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                            <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                            <SelectItem value="5m-10m">$5,000,000 - $10,000,000</SelectItem>
                            <SelectItem value="10m+">$10,000,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="funds-source-ct">
                          Source of Institution's Funds <span className="text-destructive">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger id="funds-source-ct" className="bg-card">
                            <SelectValue placeholder="-- Select an option --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="venture-capital">Venture Capital</SelectItem>
                            <SelectItem value="private-equity">Private Equity</SelectItem>
                            <SelectItem value="angel-investors">Angel Investors</SelectItem>
                            <SelectItem value="business-revenue">Business Revenue</SelectItem>
                            <SelectItem value="personal-funds">Personal Funds</SelectItem>
                            <SelectItem value="bank-loan">Bank Loan</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Do you have at least one Beneficial Owner (BO)? A BO is a person who owns at least 10% of a money-services business or 25% of another type of business.
                          <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="bo-yes-ct" />
                            <Label htmlFor="bo-yes-ct" className="font-normal cursor-pointer">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="bo-no-ct" />
                            <Label htmlFor="bo-no-ct" className="font-normal cursor-pointer">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Button variant="outline" onClick={() => goBack(step.id)} disabled={index === 0}>
                        Back
                      </Button>
                      <Button variant="outline">Save for later</Button>
                      <Button onClick={() => completeStep(step.id)}>Next</Button>
                    </div>
                  </div>
                )}

                {/* Generic Expanded Content for remaining steps */}
                {isExpanded && step.hasForm && !["business-information", "address", "compliance-transaction"].includes(step.id) && (
                  <div className="pb-6 pl-9 pr-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Complete the {step.title.toLowerCase()} to continue.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={() => goBack(step.id)} disabled={index === 0}>
                        Back
                      </Button>
                      <Button variant="outline">Save for later</Button>
                      <Button onClick={() => completeStep(step.id)}>Next</Button>
                    </div>
                  </div>
                )}

                {/* Complete step */}
                {isExpanded && step.id === "complete" && (
                  <div className="pb-6 pl-9 pr-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Review your information and submit to complete onboarding.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={() => goBack(step.id)}>
                        Back
                      </Button>
                      <Button onClick={() => completeStep(step.id)}>
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-64 space-y-6">
        {/* Application Timeline */}
        <Card className="py-0">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              Activation timeline
            </h3>
            <div className="space-y-0">
              {timeline.map((item, index) => {
                const isExpanded = expandedTimelineItems.has(item.label)
                const hasSubsteps = item.substeps && item.substeps.length > 0
                
                return (
                  <div key={item.label}>
                    <div className="flex gap-3">
                      {/* Timeline Indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "size-2 rounded-full mt-1.5 shrink-0",
                            item.status === "completed" && "bg-primary",
                            item.status === "active" && "bg-primary",
                            item.status === "pending" && "bg-muted-foreground/30"
                          )}
                        />
                        {(index < timeline.length - 1 || (hasSubsteps && isExpanded)) && (
                          <div className="w-px flex-1 bg-border my-1" />
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="pb-4 flex-1">
                        <button
                          onClick={() => {
                            if (item.expandable && hasSubsteps) {
                              setExpandedTimelineItems((prev) => {
                                const newSet = new Set(prev)
                                if (newSet.has(item.label)) {
                                  newSet.delete(item.label)
                                } else {
                                  newSet.add(item.label)
                                }
                                return newSet
                              })
                            }
                          }}
                          className={cn(
                            "flex items-center gap-1.5 text-left w-full",
                            item.expandable && hasSubsteps && "hover:opacity-70 cursor-pointer"
                          )}
                          disabled={!item.expandable || !hasSubsteps}
                        >
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          {item.expandable && hasSubsteps && (
                            <ChevronDown
                              className={cn(
                                "size-3 text-muted-foreground transition-transform",
                                isExpanded && "rotate-180"
                              )}
                            />
                          )}
                        </button>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Substeps */}
                    {hasSubsteps && isExpanded && (
                      <div className="ml-3">
                        {item.substeps!.map((substep, subIndex) => (
                          <div key={substep.label} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "size-1.5 rounded-full mt-2 shrink-0",
                                  substep.status === "completed" && "bg-primary",
                                  substep.status === "active" && "bg-primary",
                                  substep.status === "pending" && "bg-muted-foreground/30"
                                )}
                              />
                              {subIndex < item.substeps!.length - 1 && (
                                <div className="w-px flex-1 bg-border my-1" />
                              )}
                            </div>
                            <div className="pb-3 flex-1">
                              <p className="text-xs text-foreground">
                                {substep.label}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Questions Card */}
        <Card className="py-0">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm font-medium text-foreground">Questions?</h3>
            <a
              href="https://docs.paxos.com/guides/dashboard/onboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-medium"
            >
              Visit our docs page
            </a>
            <p className="text-xs text-muted-foreground">or</p>
            <a
              href="#support"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              Contact support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
