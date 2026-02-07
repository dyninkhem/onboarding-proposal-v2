export interface OnboardingStepConfig {
  id: string
  title: string
  description?: string
  type: "action" | "passive" | "terminal"
}

export interface OnboardingProgress {
  [stepId: string]: boolean
}

export const STEPS: OnboardingStepConfig[] = [
  {
    id: "business-details",
    title: "Business Details",
    description: "Provide your business name, type, and registration details.",
    type: "action",
  },
  {
    id: "business-information",
    title: "Business Information",
    description: "Add additional information about your business operations.",
    type: "action",
  },
  {
    id: "address",
    title: "Address",
    description: "Enter your registered business address.",
    type: "action",
  },
  {
    id: "compliance-transaction",
    title: "Compliance & Transaction Details",
    description: "Provide compliance and transaction-related information.",
    type: "action",
  },
  {
    id: "business-members",
    title: "Business Members",
    description: "Add key stakeholders and business members.",
    type: "action",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload required verification documents.",
    type: "action",
  },
  {
    id: "pricing-fees",
    title: "Pricing & Fees",
    description: "Review and confirm your pricing and fee structure.",
    type: "action",
  },
  {
    id: "compliance-review",
    title: "Compliance Review",
    description: "Your application is under review by the compliance team.",
    type: "passive",
  },
  {
    id: "go-live",
    title: "Go Live",
    description: "Your account is activated and ready for live operations.",
    type: "terminal",
  },
]
