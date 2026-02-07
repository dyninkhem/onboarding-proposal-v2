# PRD: Onboarding Checklist Widget

## Introduction

Build a floating setup-guide widget (modeled after Stripe's onboarding checklist) that appears anchored to the bottom-right corner of the B2B SaaS dashboard. The widget coexists alongside the current full-page onboarding flow as a supplementary navigation aid. It provides a persistent, always-visible progress tracker that guides new customers through a 9-step activation flow — from initial business details through compliance review to going live. The widget does **not** contain inline forms; it displays step titles, status indicators, and "Continue" buttons that deep-link to the existing full-page onboarding forms.

## Goals

- Provide a persistent, always-visible progress tracker on every dashboard page
- Reduce time-to-activation by giving customers a clear visual path from signup to first transaction
- Eliminate support tickets caused by customers not knowing what step to complete next
- Persist progress across sessions via stubbed API calls with mock data
- Support two visual states: expanded (full step list) and collapsed (compact launcher pill)
- Complement (not replace) the existing `OnboardingWizard` and `OnboardingCard` components

## User Stories

### US-001: Floating widget shell and positioning
**Description:** As a new customer, I want to see a floating setup-guide widget anchored to the bottom-right corner of the dashboard so that I always know my onboarding status regardless of which page I'm on.

**Acceptance Criteria:**
- [ ] Widget renders as a fixed-position panel in the bottom-right corner of the viewport
- [ ] Widget appears on all dashboard pages (rendered in the dashboard layout)
- [ ] Widget has a z-index high enough to float above all dashboard content
- [ ] Widget does not overlap or interfere with the existing sidebar navigation
- [ ] Widget uses shadcn/ui `Card` component and follows existing design tokens
- [ ] Typecheck passes

### US-002: Expanded state with step list
**Description:** As a new customer, I want to expand the widget to see all 9 onboarding steps with their completion status so that I understand the full activation path.

**Acceptance Criteria:**
- [ ] Expanded widget displays a header with title "Setup guide" and a close/collapse button
- [ ] Shows a linear progress bar indicating overall completion (e.g., "3 of 9 steps completed")
- [ ] Lists all 9 steps in order: Business Details, Business Information, Address, Compliance & Transaction Details, Business Members, Documents, Pricing and Fees, Compliance Review, Go Live
- [ ] Each step shows one of three states: completed (checkmark icon), current/active (highlighted), locked/pending (muted)
- [ ] Steps are sequential — a step appears locked until all previous steps are completed
- [ ] Expanded panel has a max-height with internal scroll if needed
- [ ] Typecheck passes

### US-003: Collapsed launcher pill
**Description:** As a customer, I want to collapse the widget into a compact pill so that it doesn't take up screen space while I'm working, but I can still see my progress at a glance.

**Acceptance Criteria:**
- [ ] Clicking the collapse button on the expanded widget transitions it to a small pill/button
- [ ] The pill shows a brief progress indicator (e.g., circular progress ring or "3/9" text)
- [ ] Clicking the pill expands the widget back to the full step list
- [ ] Collapse/expand state persists via `localStorage` so it survives page navigation
- [ ] Transition between states is animated (smooth height/opacity transition)
- [ ] Typecheck passes

### US-004: Step navigation and deep-linking
**Description:** As a new customer, I want to click a step in the widget to navigate to the corresponding onboarding form so that I can complete it without searching for the right page.

**Acceptance Criteria:**
- [ ] Each unlocked (current or completed) step is clickable
- [ ] Clicking a step navigates to `/dashboard/onboarding?step={stepId}` using the existing `navigateToOnboarding` from `OnboardingContext`
- [ ] Locked steps are not clickable and show a lock icon or muted appearance
- [ ] The "Compliance Review" step is not clickable (passive waiting state)
- [ ] The "Go Live" step is not clickable until compliance review is approved
- [ ] Typecheck passes

### US-005: Mock API persistence layer
**Description:** As a developer, I need onboarding progress to persist across page reloads so that the widget accurately reflects the customer's activation state.

**Acceptance Criteria:**
- [ ] Create a mock API module (`lib/mock-onboarding-api.ts`) that simulates GET/PUT for onboarding progress
- [ ] Mock data is stored in `localStorage` with a key like `onboarding-progress`
- [ ] The module exports async functions: `fetchOnboardingProgress()` and `updateStepStatus(stepId, completed)`
- [ ] Functions return typed responses matching an `OnboardingProgress` interface
- [ ] Add a small artificial delay (200-500ms) to simulate network latency
- [ ] The existing `OnboardingContext` is extended (or a new context is created) to consume this mock API on mount and update it on step completion
- [ ] Typecheck passes

### US-006: Extended step model for the 9-step flow
**Description:** As a developer, I need the onboarding data model to support all 9 activation steps (expanded from the current 3) so that the widget and context reflect the full onboarding flow.

**Acceptance Criteria:**
- [ ] Define a new step configuration with all 9 steps, each having: `id`, `title`, `description` (optional), `type` ('action' | 'passive' | 'terminal'), and `completed` status
- [ ] Steps with `type: 'passive'` (Compliance Review) cannot be marked complete by user action — only toggled via demo control
- [ ] Steps with `type: 'terminal'` (Go Live) are locked until the previous passive step is approved
- [ ] The step model is shared between the widget and the existing `OnboardingContext`
- [ ] Backward-compatible with existing `OnboardingWizard` which uses the first 3 sub-steps of "Business Details"
- [ ] Typecheck passes

### US-007: Compliance Review waiting state
**Description:** As a customer who has submitted all required information, I want to see that my application is under compliance review with an estimated timeline so that I know what to expect without contacting support.

**Acceptance Criteria:**
- [ ] When all steps before "Compliance Review" are complete, that step shows an active/in-progress state
- [ ] Displays text: "Under review — approx. 2–3 business days"
- [ ] Shows a subtle loading/clock indicator (not a spinner — a static icon like `Clock` from lucide-react)
- [ ] A small "(Demo: Approve)" toggle or button is visible that manually marks the review as approved
- [ ] When approved, the "Go Live" step unlocks and shows a success/celebration state
- [ ] Typecheck passes

### US-008: Go Live / Operations Live terminal state
**Description:** As a customer whose compliance review is approved, I want to see a clear "You're live" confirmation so that I know I can start transacting.

**Acceptance Criteria:**
- [ ] "Go Live" step shows a locked state until Compliance Review is approved
- [ ] When unlocked and activated, shows a success state with a checkmark and congratulatory text
- [ ] The widget header updates to reflect 100% completion
- [ ] After all steps complete, the widget can be dismissed entirely
- [ ] Typecheck passes

### US-009: Dismiss and resurface behavior
**Description:** As a customer, I want to dismiss the widget when I no longer need it and be able to bring it back from settings if needed.

**Acceptance Criteria:**
- [ ] Expanded widget has a "Dismiss" option (via a dropdown menu or secondary action)
- [ ] Dismissing the widget hides it completely and stores the preference in `localStorage`
- [ ] The widget does not reappear on subsequent page loads once dismissed
- [ ] A "Show setup guide" toggle exists somewhere accessible (e.g., in the sidebar or a settings area) to resurface the widget
- [ ] Once all 9 steps are complete, the widget auto-dismisses after a short delay
- [ ] Typecheck passes

### US-010: Responsive behavior
**Description:** As a customer on a smaller screen, I want the widget to adapt gracefully so that it remains usable without blocking the dashboard.

**Acceptance Criteria:**
- [ ] On viewports below 768px, the widget collapses to the pill state by default
- [ ] The expanded state on small screens takes full width at the bottom of the viewport
- [ ] The widget does not cause horizontal scrolling or overlap with the mobile sidebar trigger
- [ ] Uses Tailwind responsive utilities (`md:`, `lg:`) consistent with the rest of the codebase
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Render a fixed-position floating widget in the bottom-right corner of the dashboard layout (`app/dashboard/layout.tsx`)
- FR-2: Widget supports two visual modes: expanded (step list with progress bar) and collapsed (compact pill)
- FR-3: Display all 9 onboarding steps in sequential order with completion status indicators
- FR-4: Steps are sequential — each step is locked until all prior steps are marked complete
- FR-5: Clicking an unlocked step navigates to `/dashboard/onboarding?step={stepId}` via the existing routing
- FR-6: Progress bar updates in real-time as steps are completed (e.g., "3 of 9 completed")
- FR-7: "Compliance Review" step renders as a passive waiting state with "Approx. 2–3 business days" text and a demo-mode approval toggle
- FR-8: "Go Live" step is locked until Compliance Review is approved; shows success state when activated
- FR-9: Persist onboarding progress in `localStorage` via a mock API layer with async functions and artificial latency
- FR-10: Persist widget UI state (expanded/collapsed/dismissed) in `localStorage`
- FR-11: Widget can be dismissed and resurfaced from a settings control
- FR-12: On mobile viewports (<768px), the widget defaults to collapsed and expands to full-width bottom panel

## Non-Goals

- No inline forms inside the widget — it is a navigation/progress component only
- No real backend API integration — mock persistence only
- No email/push notifications for compliance review status changes
- No drag-and-drop repositioning of the widget
- No replacement of the existing `OnboardingWizard` or `OnboardingCard` — they coexist
- No animation library beyond CSS transitions and Tailwind utilities
- No A/B testing infrastructure
- No analytics/tracking integration

## Design Considerations

- Model after Stripe's setup guide widget: clean, minimal, bottom-right anchored
- Reuse existing shadcn/ui components: `Card`, `Button`, `Progress`, `Separator`, `Tooltip`
- Use `lucide-react` icons (already in project): `Check`, `Lock`, `ChevronDown`, `ChevronUp`, `Clock`, `X`
- Follow the existing color conventions: `primary` for completed states, `muted-foreground` for pending, `destructive` for errors
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Smooth expand/collapse transitions using Tailwind's `transition-all`, `duration-200`
- The existing `vaul` (Drawer) package is available if a bottom-sheet pattern is preferred for mobile

## Technical Considerations

- The widget component should be added to `app/dashboard/layout.tsx` so it appears on all dashboard routes
- Extend or wrap the existing `OnboardingProvider` in `lib/onboarding-context.tsx` to support the 9-step model and mock API persistence
- The new 9-step model must remain backward-compatible with the existing 3-step `OnboardingWizard` (steps 1–3 map to "Business Details" sub-steps)
- Widget state management should use React `useState` + `useEffect` with `localStorage` for persistence — no additional state libraries
- Mock API module should be isolated in `lib/mock-onboarding-api.ts` for easy replacement with real API calls later
- Use `useIsMobile()` hook from `@/hooks/use-mobile.ts` (already exists) for responsive behavior
- All components must be client components (`"use client"`) since they use browser APIs and state

## Success Metrics

- New customer can identify their next onboarding step within 3 seconds of dashboard load
- Widget is visible and functional on every dashboard page without additional navigation
- Progress persists across page reloads (verified via `localStorage`)
- All 9 steps can be traversed from start to "Go Live" in a demo walkthrough
- Zero TypeScript errors introduced
- No visual regression to existing dashboard components

## Open Questions

- Should the widget show a brief onboarding tutorial/tooltip on first appearance ("Here's your setup guide")?
- Should completed steps be re-openable for editing, or permanently locked once done?
- Should there be a keyboard shortcut to toggle the widget (e.g., `Ctrl+Shift+O`)?
- What exact copy should the "Go Live" celebration state display?
