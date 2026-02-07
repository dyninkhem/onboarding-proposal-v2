export interface OnboardingStepConfig {
  id: string
  title: string
  description: string
  type: "action" | "passive" | "terminal"
}

export interface OnboardingProgress {
  [stepId: string]: boolean
}

export const STEPS: OnboardingStepConfig[] = [
  {
    id: "business-details",
    title: "Business Details",
    description: "Enter your legal business name, entity type, and registration number.",
    type: "action",
  },
  {
    id: "business-information",
    title: "Business Information",
    description: "Describe your industry, expected transaction volume, and business model.",
    type: "action",
  },
  {
    id: "address",
    title: "Address",
    description: "Provide your registered business address for verification.",
    type: "action",
  },
  {
    id: "compliance-transaction",
    title: "Compliance & Transaction",
    description: "Share your expected payment flows, currencies, and compliance requirements.",
    type: "action",
  },
  {
    id: "business-members",
    title: "Business Members",
    description: "Add beneficial owners, directors, and authorized signatories.",
    type: "action",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload identity documents, proof of address, and incorporation papers.",
    type: "action",
  },
  {
    id: "pricing-fees",
    title: "Pricing & Fees",
    description: "Review your pricing plan and confirm the fee structure for your account.",
    type: "action",
  },
  {
    id: "compliance-review",
    title: "Compliance Review",
    description: "Our compliance team will review your application — this typically takes 2–3 business days.",
    type: "passive",
  },
  {
    id: "go-live",
    title: "Go Live",
    description: "Once approved, your account will be activated for live operations.",
    type: "terminal",
  },
]
