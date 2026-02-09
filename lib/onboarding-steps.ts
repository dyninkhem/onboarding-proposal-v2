export interface OnboardingStepConfig {
  id: string
  title: string
  description: string
  type: "action" | "passive" | "terminal" | "completed"
  section?: "onboarding" | "activation"
}

export interface OnboardingProgress {
  [stepId: string]: boolean
}

export const STEPS: OnboardingStepConfig[] = [
  {
    id: "verify-account",
    title: "Verify Account",
    description: "Account verification is complete.",
    type: "completed",
  },
  {
    id: "business-profile",
    title: "Business Profile",
    description: "Enter your company identity, business information, and address.",
    type: "action",
    section: "onboarding",
  },
  {
    id: "compliance-transaction",
    title: "Compliance & Transaction",
    description: "Share your expected payment flows, currencies, and compliance requirements.",
    type: "action",
    section: "onboarding",
  },
  {
    id: "people-documents",
    title: "People & Documents",
    description: "Add business members and upload their associated documents.",
    type: "action",
    section: "onboarding",
  },
  {
    id: "pricing-fees",
    title: "Pricing & Fees",
    description: "Review your pricing plan and confirm the fee structure for your account.",
    type: "action",
    section: "onboarding",
  },
  {
    id: "invite-team",
    title: "Invite Your Team",
    description: "Invite team members by email and assign roles.",
    type: "action",
    section: "activation",
  },
  {
    id: "add-accounts",
    title: "Add Accounts",
    description: "Connect your fiat bank accounts and crypto wallet addresses.",
    type: "action",
    section: "activation",
  },
  {
    id: "approval-policies",
    title: "Approval Policies",
    description: "Configure approval workflows, transaction limits, and approver roles.",
    type: "action",
    section: "activation",
  },
  {
    id: "review-go-live",
    title: "Review & Go Live",
    description: "Compliance review status and go-live activation.",
    type: "passive",
    section: "activation",
  },
]
