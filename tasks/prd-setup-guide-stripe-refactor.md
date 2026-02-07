# PRD: Setup Guide Widget — Stripe Pattern Refactor

## Introduction

Refactor the existing onboarding setup guide widget (`components/setup-guide-widget.tsx`) to match Stripe's setup guide pattern. This is a targeted revision — not a rebuild — covering three changes: removing step locking, adding expandable accordion detail panels per step, and aligning visual design with Stripe's compact, information-dense card pattern. The existing context/state management (`lib/onboarding-context.tsx`), localStorage persistence (`lib/mock-onboarding-api.ts`), step data model (`lib/onboarding-steps.ts`), expand/collapse widget behavior, dismiss/resurface logic, and mobile responsiveness are preserved.

## Goals

- Remove all step-locking logic so users can complete steps in any order
- Add single-expand accordion behavior to each step, revealing a description and CTA
- Match Stripe's visual design language using existing design tokens and theme variables (spiritually similar, not pixel-perfect)
- Preserve all existing widget behavior: expand/collapse pill, dismiss via overflow menu, auto-dismiss on completion, localStorage persistence, mobile layout
- Maintain existing context API surface — no breaking changes to `useOnboarding`

## User Stories

### US-001: Remove step locking
**Description:** As a user, I want to click any step in the setup guide regardless of completion order so that I can work on whichever step I'm ready for.

**Acceptance Criteria:**
- [ ] No lock icons (`Lock` from lucide-react) appear anywhere in the widget
- [ ] The `isStepLocked()` function and all references to locked state are removed from `setup-guide-widget.tsx`
- [ ] All 9 steps render with either a filled checkmark (complete) or hollow circle (incomplete) — no other icon states except the Compliance Review passive state
- [ ] Every incomplete action step is clickable and navigates to its onboarding page via `navigateToOnboarding(step.id)`
- [ ] The `cursor-not-allowed` class is never applied to any step (except Compliance Review when in passive waiting state, and Go Live when incomplete)
- [ ] The active/highlighted step defaults to the first incomplete step (existing `currentStepId` logic)
- [ ] Typecheck passes (`pnpm run build`)

### US-002: Add accordion expand/collapse to each step
**Description:** As a user, I want to expand a step to see a short description and a CTA button so that I understand what each step involves before navigating.

**Acceptance Criteria:**
- [ ] Each step row is expandable via click to reveal a detail panel
- [ ] Uses the existing shadcn/ui `Accordion` component (`components/ui/accordion.tsx`) with Radix `AccordionPrimitive` in `type="single"` and `collapsible` mode
- [ ] Only one step detail panel is open at a time — opening one collapses the previously open one
- [ ] The expanded step's detail panel contains:
  - A short description (1–2 sentences) — hardcoded per step, sourced from the `description` field already defined in `lib/onboarding-steps.ts` `STEPS` array
  - A CTA button (label: "Start" if step is incomplete, "Continue" if step is incomplete but partially filled, or "Review" if step is complete) that calls `navigateToOnboarding(step.id)` and collapses the widget
- [ ] For the Compliance Review step (type `"passive"`), when incomplete, the detail panel shows "Under review — approx. 2–3 business days" text and the `(Demo: Approve)` button instead of a navigation CTA
- [ ] For the Go Live step (type `"terminal"`), when incomplete, the detail panel shows "Your account will go live once compliance review is approved" — no CTA button. When complete, shows "Operations Live" badge
- [ ] The default expanded step on mount is the first incomplete step (`currentStepId`)
- [ ] Keyboard navigation works: Enter/Space toggles expand on focused step row
- [ ] Typecheck passes (`pnpm run build`)
- [ ] **Verify in browser using dev-browser skill**

### US-003: Restyle widget header to match Stripe pattern
**Description:** As a developer, I need to update the widget header to match Stripe's compact header pattern with progress bar.

**Acceptance Criteria:**
- [ ] Header shows "Setup guide" title (`text-sm font-semibold`) on the left
- [ ] Below the title, show `"{completedCount} of {totalSteps} steps completed"` in `text-sm text-muted-foreground` (replaces `text-xs`)
- [ ] When all steps are complete, the subtitle changes to "You're all set!" in `text-primary` (preserve existing behavior)
- [ ] Right side of header: overflow menu (`MoreHorizontal` icon) with "Dismiss setup guide" option (preserve existing), then collapse chevron (`ChevronDown` icon) to minimize widget (preserve existing)
- [ ] Progress bar: thin `h-1` bar, full width within card content area, `rounded-full`, brand/primary fill color, muted track — uses the existing shadcn `Progress` component
- [ ] Remove the `ProgressRing` SVG component entirely — it is only used in the collapsed pill and will be replaced
- [ ] Typecheck passes (`pnpm run build`)
- [ ] **Verify in browser using dev-browser skill**

### US-004: Restyle step rows and expanded panel to match Stripe
**Description:** As a developer, I need to update step row styling and expanded state to match Stripe's visual density and design language.

**Acceptance Criteria:**
- [ ] Card container: `bg-white border border-border rounded-xl shadow-lg`, width `w-96` (~384px) on desktop. On mobile, preserve existing full-width bottom-anchored behavior
- [ ] Each collapsed step row: `px-4 py-2.5` padding, no background, shows status icon (left) + step label + chevron indicator (right). Hover state: `hover:bg-accent/30`
- [ ] Status icons: Complete = filled circle with checkmark in `bg-primary` + `text-primary-foreground` (preserve existing). Incomplete = hollow circle with `border-2 border-muted-foreground/40` (preserve existing)
- [ ] The expanded/active step row: `bg-muted/50` background + `border-l-2 border-primary` left accent spanning the full row. The detail content sits below the label within this highlighted region
- [ ] Collapsed steps show a small chevron icon on the right side of the row (▼ when collapsed, rotates ▲ when expanded)
- [ ] No dividers/borders between individual step rows — the background highlight is the primary visual separator (override default `AccordionItem` `border-b` class)
- [ ] Spacing is compact: row padding `py-2.5`, detail panel padding below label is `pt-2 pb-3`
- [ ] The collapsed pill (minimized state) shows a simple `bg-primary` pill with `"{completedCount}/{totalSteps}"` text and a small progress indicator — remove the `ProgressRing` SVG and replace with a simpler text-based pill
- [ ] Typecheck passes (`pnpm run build`)
- [ ] **Verify in browser using dev-browser skill**

### US-005: Update step descriptions in data model
**Description:** As a developer, I need to ensure each step in `lib/onboarding-steps.ts` has a meaningful `description` field for display in the accordion detail panel.

**Acceptance Criteria:**
- [ ] Each of the 9 steps in `STEPS` array has a `description` string of 1–2 sentences
- [ ] Descriptions are specific enough to tell the user what they need to do/provide in that step
- [ ] The `OnboardingStepConfig` interface already has `description?: string` — change it to required: `description: string`
- [ ] Existing descriptions are reviewed and updated if they are too generic
- [ ] The `OnboardingStep` type in `lib/onboarding-context.tsx` is updated to include `description: string` and `buildSteps()` passes it through
- [ ] Typecheck passes (`pnpm run build`)

## Functional Requirements

- FR-1: Remove `isStepLocked()` function and all lock-related logic/icons from `setup-guide-widget.tsx`
- FR-2: All 9 steps are always clickable (except passive Compliance Review when in-progress, and terminal Go Live when incomplete)
- FR-3: Replace flat step list with shadcn `Accordion` (`type="single"`, `collapsible`) wrapping each step as an `AccordionItem`
- FR-4: Default expanded accordion value is the `currentStepId` (first incomplete step)
- FR-5: Expanded panel shows step `description` from `STEPS` config + CTA button calling `navigateToOnboarding(step.id)`
- FR-6: Compliance Review expanded panel shows passive waiting text + demo approve button instead of CTA
- FR-7: Go Live expanded panel shows status text only — no CTA when incomplete
- FR-8: Widget header displays "Setup guide" title, "{X} of 9 steps completed" subtitle, overflow menu with dismiss, collapse chevron
- FR-9: Progress bar is `h-1` thin horizontal bar below header using existing `Progress` component
- FR-10: Card styling: `bg-white border border-border rounded-xl shadow-lg w-96` on desktop
- FR-11: Active/expanded step has `bg-muted/50 border-l-2 border-primary` visual treatment
- FR-12: Collapsed step rows have `px-4 py-2.5` padding, `hover:bg-accent/30`, no background, chevron icon on right
- FR-13: Remove `ProgressRing` component — replace collapsed pill with text-based progress pill
- FR-14: Preserve all existing behavior: `localStorage` widget-expanded persistence, widget-dismissed persistence, auto-dismiss timer on completion, mobile full-width layout, `useOnboarding` context API

## Non-Goals

- No changes to `lib/onboarding-context.tsx` context API surface (only `buildSteps` and `OnboardingStep` type get a `description` field addition)
- No changes to `lib/mock-onboarding-api.ts`
- No changes to `components/onboarding-wizard.tsx` (the form wizard is separate from the widget)
- No changes to step routing or navigation targets
- No pixel-perfect Stripe reproduction — use existing design tokens and theme
- No test framework setup or new test infrastructure (no test framework currently configured)
- No changes to the `components/ui/accordion.tsx` shadcn primitive itself
- No changes to `components/onboarding-card.tsx` or `components/onboarding-welcome-card.tsx`

## Design Considerations

### Stripe Reference Pattern (Spiritual Match)
- **Card**: White floating card, bottom-right anchored, `rounded-xl shadow-lg`, ~384px wide
- **Header**: Title + subtitle + icon buttons, compact `p-4` padding
- **Progress bar**: Thin full-width bar between header and step list
- **Step list as accordion**: Single-expand, no dividers, background highlight differentiates active step
- **Active step**: Light gray/muted background + left border accent in brand color
- **Collapsed steps**: Icon + label + chevron, no background, tight vertical padding
- **Typography**: `text-sm` throughout, `font-semibold` for titles, `font-normal` for descriptions
- **Density**: Compact — `py-2.5` rows, no dividers, background highlight as separator

### Existing Components to Reuse
- `components/ui/accordion.tsx` — Radix-based accordion primitive (already installed: `@radix-ui/react-accordion@1.2.2`)
- `components/ui/progress.tsx` — Progress bar
- `components/ui/button.tsx` — CTA buttons
- `components/ui/card.tsx` — Card container (CardHeader, CardContent)
- `components/ui/dropdown-menu.tsx` — Overflow menu
- `lucide-react` icons: `Check`, `ChevronDown`, `MoreHorizontal`, `Clock`
- Remove `Lock` icon import

### Files to Modify
1. **`components/setup-guide-widget.tsx`** — Primary change target. Remove locking, add accordion, restyle
2. **`lib/onboarding-steps.ts`** — Make `description` required, update descriptions
3. **`lib/onboarding-context.tsx`** — Add `description` to `OnboardingStep` type, pass through in `buildSteps()`

## Technical Considerations

- The shadcn `Accordion` uses Radix `AccordionPrimitive.Root` with `type="single"` and `collapsible` props for single-expand behavior. The `value` and `onValueChange` props control which item is expanded — wire this to local state initialized from `currentStepId`
- The default `AccordionItem` has `border-b last:border-b-0` — override with `border-b-0` to remove dividers per Stripe pattern
- The default `AccordionTrigger` includes a `hover:underline` class and built-in chevron icon — customize these via className overrides to match Stripe styling (remove underline, position chevron correctly)
- The default `AccordionContent` animates open/close via `animate-accordion-up` / `animate-accordion-down` — preserve this
- Status icon (checkmark/circle) should be rendered inside the `AccordionTrigger` alongside the step label, not as part of the content
- The CTA button in expanded detail should call `navigateToOnboarding(step.id)` AND `setExpanded(false)` to minimize the widget after navigation (preserving existing click-to-navigate behavior)
- `currentStepId` from context determines the default expanded step on mount. The user can override by clicking a different step
- No test framework is configured in the project (`package.json` has no test script, no vitest/jest dependency). The "update existing tests" answer from the user is noted but there are no tests to update. If a test framework is added in the future, tests should cover: accordion expand/collapse, step clickability without locks, CTA navigation, passive step rendering

## Success Metrics

- All 9 steps are clickable without sequential gating
- Accordion expand/collapse works with single-expand behavior
- Widget visually resembles Stripe's setup guide pattern at a glance (compact card, progress bar, accordion steps, highlighted active step with left accent)
- All existing widget behavior is preserved: expand/collapse pill, dismiss, auto-dismiss, localStorage persistence, mobile layout
- `pnpm run build` passes with zero errors

## Open Questions

- Should the CTA button label differentiate between "Start" (never touched) and "Continue" (partially filled)? Current data model does not track partial completion — only boolean complete/incomplete per step. **Recommendation:** Use "Start" for incomplete, "Review" for complete. Defer "Continue" to a future iteration that adds partial-progress tracking.
- Should the collapsed pill (minimized state) include a mini progress bar or just text? **Recommendation:** Text-based pill (`{completedCount}/{totalSteps}`) with `bg-primary` background for simplicity. The progress ring SVG is being removed.
