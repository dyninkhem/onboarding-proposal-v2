# PRD: Setup Guide Widget — Polish Pass

## Introduction

Three targeted refinements to the setup guide widget (`components/setup-guide-widget.tsx`). This is a polish pass on the existing Stripe-pattern implementation — not a rebuild. Changes: (1) redesign the collapsed/minimized state from a small pill to a compact mini-card that previews the next action, (2) increase information density by tightening padding throughout, and (3) apply a heavier card shadow for stronger visual elevation. All existing accordion behavior, step tracking, dismiss/resurface logic, and state persistence are preserved.

## Goals

- Replace the collapsed pill with a compact mini-card that shows "Setup guide" title, progress bar, and "Next: [step name]" link
- Tighten padding throughout the expanded widget for denser, sidebar-nav-like scannability
- Apply a heavier, layered shadow to both collapsed and expanded states for macOS-popover-level elevation
- Preserve all existing behavior: accordion expand/collapse, step completion, dismiss/resurface, localStorage persistence, mobile layout

## User Stories

### US-001: Redesign collapsed state as a mini-card
**Description:** As a user, I want the collapsed widget to show me what step is next so I can jump directly to it without expanding the full guide.

**Acceptance Criteria:**
- [ ] The collapsed state renders as a `Card` (not a `button`) with the same styling as the expanded widget: `bg-white border border-border rounded-xl`, width `w-96` on desktop
- [ ] On mobile, the collapsed mini-card uses the same full-width bottom-anchored behavior as the expanded state: `inset-x-0 bottom-0 w-full rounded-b-none`
- [ ] Row 1: "Setup guide" title in `text-sm font-semibold` on the left. A `Maximize2` icon button (from `lucide-react`) on the right that expands the widget. No X/dismiss button in this state
- [ ] Row 2: Thin progress bar identical to the expanded widget (`Progress` component, `h-1`, brand color fill, muted track, full width)
- [ ] Row 3 when steps remain incomplete: "Next:" in `text-sm text-muted-foreground` followed by the first incomplete actionable step name as a clickable link in `text-sm text-primary font-medium`. Clicking the step name calls `navigateToOnboarding(stepId)`. If the first incomplete step is Compliance Review (passive type), skip it and show the next actionable incomplete step. If no actionable steps remain (only passive/terminal incomplete), show "Next: Compliance Review" as static text (not a link)
- [ ] Row 3 when all steps are complete: show "All steps complete" in `text-sm text-primary font-medium` instead of "Next: ..."
- [ ] Clicking anywhere on the card that is NOT the step name link expands the widget (`setExpanded(true)`)
- [ ] The `ProgressRing` component is already removed — ensure no remnants remain
- [ ] The collapsed mini-card uses the same fixed positioning as the expanded widget: `fixed right-4 bottom-4 z-50` on desktop
- [ ] Typecheck passes (`pnpm run build`)
- [ ] **Verify in browser using dev-browser skill**

### US-002: Increase information density in expanded widget
**Description:** As a user, I want the expanded widget to feel tight and scannable like a dense sidebar nav so it takes up less vertical space as a floating overlay.

**Acceptance Criteria:**
- [ ] CardHeader padding: change from `pb-2` to `pb-1.5` (tighter header-to-content gap)
- [ ] CardContent padding: add `px-3` to the CardContent className (reduce horizontal padding from default `p-6`/`px-6` to `px-3`), keep `pb-4` (or reduce to `pb-3`)
- [ ] Step row (AccordionTrigger) padding: change from `px-4 py-2.5` to `px-3 py-1.5`
- [ ] Gap between status icon and step label: change from `gap-3` to `gap-2` in the flex container inside AccordionTrigger
- [ ] Expanded step detail panel (AccordionContent) padding: change from `pt-2 pb-3 px-4` to `pt-1.5 pb-2 px-3`
- [ ] Detail panel inner indent: keep `pl-8` (to align with step label text past the icon) but update to `pl-7` to match the tighter gap
- [ ] Progress bar: reduce surrounding spacing — the `space-y-3` on CardContent should change to `space-y-2`
- [ ] The full 9-step list with one expanded should feel compact — no row should exceed ~36px collapsed height
- [ ] Typecheck passes (`pnpm run build`)
- [ ] **Verify in browser using dev-browser skill**

### US-003: Apply heavier card shadow
**Description:** As a developer, I need the widget to have stronger visual elevation so it feels like a macOS popover floating above the dashboard.

**Acceptance Criteria:**
- [ ] Replace `shadow-lg` with `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` on the expanded Card's className
- [ ] Apply the same shadow class to the collapsed mini-card so both states feel like the same element
- [ ] The shadow is applied on both desktop and mobile layouts
- [ ] No other styling changes in this story
- [ ] Typecheck passes (`pnpm run build`)
- [ ] **Verify in browser using dev-browser skill**

## Functional Requirements

- FR-1: Replace the collapsed `button` element with a `Card` component matching expanded widget dimensions (`w-96` desktop, full-width mobile)
- FR-2: Collapsed mini-card shows 3 rows: title + expand icon, progress bar, "Next: [step name]" link
- FR-3: "Next:" step is the first incomplete step whose type is `"action"` — skip `"passive"` and `"terminal"` types. If no action steps remain incomplete, fall back to showing the first incomplete step of any type as static text
- FR-4: When all steps are complete, Row 3 shows "All steps complete" in `text-primary`
- FR-5: Clicking the step name in Row 3 navigates via `navigateToOnboarding(stepId)`. Clicking elsewhere on the mini-card calls `setExpanded(true)`
- FR-6: Import `Maximize2` from `lucide-react` for the expand icon button in the collapsed state
- FR-7: Tighten all padding values in expanded widget: header `pb-1.5`, content `px-3 space-y-2`, trigger `px-3 py-1.5 gap-2`, detail `pt-1.5 pb-2 px-3 pl-7`
- FR-8: Replace `shadow-lg` with `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` on both collapsed and expanded Card elements
- FR-9: Preserve all existing behavior: accordion state, localStorage persistence (`widget-expanded`, `widget-dismissed`), auto-dismiss timer, mobile layout, step completion tracking

## Non-Goals

- No changes to `lib/onboarding-context.tsx`
- No changes to `lib/onboarding-steps.ts`
- No changes to `lib/mock-onboarding-api.ts`
- No changes to accordion behavior (single-expand, collapsible)
- No changes to step completion logic or navigation targets
- No changes to dismiss/resurface logic
- No new components — all changes are within `components/setup-guide-widget.tsx`

## Design Considerations

### Collapsed Mini-Card Layout (Stripe Reference)
```
┌──────────────────────────────────┐
│  Setup guide              [↗]   │  ← Row 1: title + expand icon
│  ████████░░░░░░░░░░░░░░░░░░░░░  │  ← Row 2: progress bar
│  Next: Business Details         │  ← Row 3: next step link
└──────────────────────────────────┘
```
- Same width as expanded widget (~384px / `w-96`)
- Compact: 3 rows, no step list, no accordion
- Single click target for "Next:" step name navigates; card click expands

### Existing Components Used
- `Card`, `CardContent` from `@/components/ui/card` — for mini-card container
- `Progress` from `@/components/ui/progress` — for Row 2 bar
- `Button` from `@/components/ui/button` — for expand icon button
- `Maximize2` from `lucide-react` — diagonal expand arrow icon (already available in installed version `^0.468.0`)

### File to Modify
- **`components/setup-guide-widget.tsx`** — sole change target for all 3 stories

## Technical Considerations

- The collapsed state currently renders a `<button>` element (lines 72–83 of current file). This will be replaced with a `<Card>` block. The click-to-expand behavior moves from the outer `<button>` onClick to a dedicated `Maximize2` icon button and a card-level onClick, with `e.stopPropagation()` on the step name link to prevent card-level expansion when clicking the link
- The "next actionable step" logic: `steps.find(s => !s.completed && s.type === "action")` — if this returns `undefined`, fall back to `steps.find(s => !s.completed)` for static text display
- The `Maximize2` icon is the diagonal-arrow expand icon from lucide-react (confirmed available in `^0.468.0`)
- The custom shadow `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` is a Tailwind arbitrary value — no config changes needed
- All padding adjustments are className string changes — no structural JSX modifications required for US-002

## Success Metrics

- Collapsed mini-card shows the next actionable step at a glance without expanding
- The expanded widget's 9-step list with one expanded step is visibly more compact than before
- The widget shadow gives a clear floating/popover feel on both light and dark backgrounds
- `pnpm run build` passes with zero errors

## Open Questions

None — scope is tightly defined.
