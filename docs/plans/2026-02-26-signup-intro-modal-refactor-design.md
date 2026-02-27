# Signup Flow & Intro Modal Refactor — Design

## Overview

Refactor the signup flow from a 7-page multi-step process to a minimal 2-page flow (signup + success redirect), and introduce a Stripe-style intro modal on the dashboard that collects business details, recommends offerings, and infers the onboarding entity type.

## Decisions

- **Architecture:** Standalone modal component + shared localStorage store (Approach A). The intro modal is decoupled from the existing setup guide/OnboardingContext.
- **Modal dismissibility:** Skippable with re-entry. Users can close at any step; a dashboard CTA lets them re-open.
- **Right panel:** Static Paxos-branded illustration (gradient + logo). No reactive preview.
- **PTC vs PTE branching:** Deferred. Store entity type and selected offerings but keep the same 9-step setup guide for both paths.
- **USDL handling:** Hidden for US users, shown for Non-US. PME entity stored via `hasUSDL` flag rather than overriding the primary entity type.

## 1. Signup Simplification

### Current flow (7 pages)

`/signup/email` → `/signup/verify` → `/signup/passkey` → `/signup/business` → `/signup/personal` → `/signup/terms` → `/signup/success`

### New flow (2 pages)

**`/signup`** — Single page with three fields:

| Field | Type | Required |
|-------|------|----------|
| Email | Email input | Yes |
| Password | Password input | Yes |
| Company name | Text input | Yes |

Single "Create account" button. `SignupFlowContext` reduced to `{ email, password, companyName }`.

**`/signup/success`** — Transient confirmation:

- Brief animation (checkmark + "Account created" text)
- Auto-redirects to `/dashboard` after ~2 seconds via `setTimeout` + `router.push`
- Clears signup sessionStorage on mount

### Pages to remove

- `/signup/email` (replaced by `/signup`)
- `/signup/verify`
- `/signup/passkey`
- `/signup/business`
- `/signup/personal`
- `/signup/terms`

## 2. Intro Modal — Structure

### Trigger

Opens automatically when user lands on `/dashboard` and `localStorage.getItem("intro-complete")` is falsy.

### Re-entry

If skipped/closed, a CTA on the dashboard (banner or button) lets the user re-open the modal.

### Layout (all 4 steps)

- Full-screen centered overlay with backdrop dimming
- Two-column rounded card (~max-w-4xl):
  - **Left panel (~55%):** Form content, heading, description, inputs, navigation
  - **Right panel (~45%):** Static Paxos-branded illustration (gradient background, decorative card with logo and company name)
- Close button (X) in top-right corner
- Built with shadcn `Dialog` (Radix) for accessibility (focus trap, Escape key, overlay click)
- No visible step indicator — navigation via "Back" link and "Continue" button

## 3. Intro Modal — Steps

### Step 1: Business Details (s-01 layout)

**Heading:** "Welcome to Paxos"
**Subtext:** "Answer a few questions about your business to customize your setup. You can always change this later."

| Field | Type | Required |
|-------|------|----------|
| First name | Text input | Yes |
| Last name | Text input | Yes |
| Business function | Select dropdown | Yes |
| Country of incorporation | Country select dropdown | Yes |
| Incorporation ID type | Select dropdown | Yes |
| Incorporation ID | Text input | Yes |

**Footer:** "Skip for now" link (left) + "Continue" button (right)

### Step 2: Recommendations (s-02 layout)

**Heading:** "Recommendations for you"
**Subtext:** "Based on your business details, these options will work best for your business."

Pre-selected checkbox cards filtered by country:

- **US users:** All offerings except USDL
- **Non-US users:** All offerings including USDL

Hardcoded recommended subset (pre-checked):

- **US:** "Access & distribute stablecoins" + "Digital asset custody"
- **Non-US:** "Access & distribute stablecoins" + "Earn yield on stablecoins (USDL)"

Users can uncheck cards they don't want.

**Footer:** "← Back" (top-left) + "Skip for now" (left) + "Continue" (right)

### Step 3: All Offerings (s-03 layout)

**Heading:** "Are there other ways you want to use Paxos?"
**Subtext:** "This step is optional. You can always change this later."

Selectable chip/pill buttons in flowing layout. Selections from Step 2 carry over as pre-selected. Full list (8 items, USDL hidden for US):

1. Access & distribute stablecoins (PYUSD, USDP, USDG)
2. Earn yield on stablecoins (USDL) — Non-US only
3. Digital asset custody
4. Crypto trading (buy, sell, trade)
5. Payments & remittance
6. Launch a branded stablecoin
7. Tokenized gold (PAXG)
8. Global Dollar Network partner

Each chip has a hover tooltip with the full description from the offerings table.

**Footer:** "← Back" (top-left) + full-width "Continue" button

### Step 4: Confirmation (s-04 layout)

**Heading:** "Get started with your account"
**Subtext:** "Your account is ready. Here's what comes next."

Numbered vertical timeline:

1. **Complete your setup** — Follow the steps in your setup guide to explore features that fit your business needs.
2. **Submit for review** — When you're ready, submit your application for compliance review.
3. **You're ready to go** — Once approved, start using Paxos services with your selected offerings.

**Footer:** "← Back" (top-left) + full-width "Get started" button (closes modal)

## 4. Data Model

### Offerings catalog type (`lib/intro-data.ts`)

```ts
type Offering = {
  id: string                                    // e.g., "stablecoin-access"
  label: string                                 // short chip label
  description: string                           // full tooltip description
  geographyFilter: "all" | "us-only" | "non-us-only"
  entityType: "PTC" | "PTE" | "PME"
  category: string                              // "Stablecoin Solutions", "Custody", etc.
}
```

### Geography → Entity inference

- US → PTC (default)
- Non-US → PTE (default)
- Non-US + USDL selected → PTE with `hasUSDL: true`

### localStorage schema

```ts
// Key: "intro-complete" → boolean
// Key: "intro-data" → JSON:
{
  firstName: string,
  lastName: string,
  businessFunction: string,
  countryOfIncorporation: string,
  incorporationIdType: string,
  incorporationId: string,
  entityType: "PTC" | "PTE",
  hasUSDL: boolean,
  selectedOfferings: string[],
  completedAt: string  // ISO timestamp
}
```

If skipped: `intro-complete` = false, `intro-data` holds partial data or null.

## 5. File Structure

### New files

```
lib/
  intro-data.ts                 # offerings catalog, geography mapping, types
components/
  intro-modal/
    intro-modal.tsx             # main modal shell (Dialog + two-column layout)
    step-business.tsx           # Step 1 form
    step-recommendations.tsx    # Step 2 checkbox cards
    step-offerings.tsx          # Step 3 chips
    step-confirmation.tsx       # Step 4 timeline + CTA
```

### Modified files

```
app/signup/                     # consolidate to single page
app/signup/success/page.tsx     # replace with auto-advancing animation
app/dashboard/layout.tsx        # mount IntroModal
components/signup/signup-flow-context.tsx  # reduce to 3 fields
```

### Removed files

```
app/signup/email/
app/signup/verify/
app/signup/passkey/
app/signup/business/
app/signup/personal/
app/signup/terms/
```

## 6. Offerings × Geography × Entity Reference

From the reference table:

| Offering (short label) | US Entity | Non-US Entity | Notes |
|------------------------|-----------|---------------|-------|
| Access & distribute stablecoins | PTC | PTE | — |
| Earn yield on stablecoins (USDL) | N/A | PME | Hidden for US |
| Digital asset custody | PTC | PTC | Non-US also PTC per table |
| Crypto trading | PTC | PTE | — |
| Payments & remittance | PTC | PTE | — |
| Launch a branded stablecoin | PTC | PTE | — |
| Tokenized gold (PAXG) | PTC | PTE | — |
| Global Dollar Network partner | PTC | PTE | — |
