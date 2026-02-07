# PRD: Setup Guide Widget — Polish Pass v2

## Introduction

A targeted polish pass on the existing setup guide widget (`components/setup-guide-widget.tsx`). Three focused refinements to the collapsed state design, information density, and card elevation. No structural or behavioral changes — all modifications are className and JSX-template level.

## Goals

- Replace the collapsed mini-card's current layout with a tighter, Stripe-inspired compact card that previews the next action step
- Increase information density in the expanded widget by tightening padding across all elements
- Apply a heavier, layered shadow to both collapsed and expanded states for macOS-popover-level elevation

## User Stories

### US-001: Redesign collapsed state as a compact mini-card with next-step preview
**Description:** As a user, I want the collapsed widget to show me what step is next so I can jump directly to it without expanding the full guide.

**Acceptance Criteria:**
- [ ] The collapsed mini-card uses the same container styling as the expanded widget: `bg-white border border-border rounded-xl`, width `w-96` on desktop, `fixed right-4 bottom-4 z-50`
- [ ] On mobile (`isMobile`), the collapsed mini-card uses `inset-x-0 bottom-0 w-full rounded-b-none` — same as expanded state
- [ ] Row 1: "Setup guide" title in `text-sm font-semibold` on the left. A `Maximize2` icon button (import from lucide-react) on the right that calls `setExpanded(true)`. No dismiss/X button in the collapsed state
- [ ] Row 2: `Progress` component with `h-1` class, same `progressValue` calculation as expanded state, full width
- [ ] Row 3 when steps remain: "Next:" in `text-sm text-muted-foreground`, followed by the next actionable step name in `text-sm text-primary font-medium` as a clickable `<button>`
- [ ] The "next actionable step" is determined by: `steps.find(s => !s.completed && s.type === 'action')`. If no action steps remain incomplete, fall back to `steps.find(s => !s.completed)` and render it as static text (not a link)
- [ ] Clicking the step name calls `navigateToOnboarding(stepId)` with `e.stopPropagation()` to prevent card expansion
- [ ] Clicking anywhere else on the card calls `setExpanded(true)`
- [ ] Row 3 when all steps complete (`isOnboardingComplete`): show "All steps complete" in `text-sm text-primary font-medium` instead of Next: line
- [ ] No circular progress ring or "X/9" counter text in the collapsed state — the progress bar is the only indicator
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-002: Increase information density by tightening padding
**Description:** As a user, I want the expanded widget to feel tight and scannable like a dense sidebar nav so it takes up less vertical space.

**Acceptance Criteria:**
- [ ] `CardHeader`: change padding from `pb-2` to `pb-1.5`
- [ ] `CardContent`: change `space-y-3` to `space-y-2`, and change `pb-4` to `pb-3`
- [ ] `AccordionTrigger`: change from `px-4 py-2.5` to `px-3 py-1.5`
- [ ] `AccordionTrigger` inner flex container: change `gap-3` to `gap-2`
- [ ] `AccordionContent`: change from `pt-2 pb-3 px-4` to `pt-1.5 pb-2 px-3`
- [ ] `AccordionContent` inner div indent: change `pl-8` to `pl-7` to match tighter gap
- [ ] All padding changes are className-only — no structural JSX changes
- [ ] The collapsed mini-card (from US-001) should use `p-3` for its internal padding
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Apply heavier layered shadow to both widget states
**Description:** As a developer, I need the widget to have stronger visual elevation so it feels like a macOS popover floating above the dashboard.

**Acceptance Criteria:**
- [ ] On the expanded `Card` className, replace `shadow-lg` with `shadow-[0_8px_30px_rgb(0,0,0,0.12)]`
- [ ] On the collapsed mini-card `Card`/container className, apply the same `shadow-[0_8px_30px_rgb(0,0,0,0.12)]`
- [ ] The shadow is present on both desktop and mobile layouts
- [ ] No other styling or structural changes in this story
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Collapsed state renders as a 3-row `Card` (title+expand, progress bar, next step) — not a pill button
- FR-2: Collapsed card shares the same width and border styling as the expanded card
- FR-3: "Next:" row shows the first incomplete action step as a clickable link; falls back to first incomplete non-action step as static text
- FR-4: Clicking the step name in collapsed state navigates to that step's onboarding page without expanding the widget
- FR-5: Expanded widget padding is tightened across CardHeader, CardContent, AccordionTrigger, and AccordionContent
- FR-6: Both collapsed and expanded states use `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` for elevation

## Non-Goals

- No changes to accordion expand/collapse behavior
- No changes to step completion tracking, dismiss/resurface logic, or localStorage persistence
- No changes to the 9-step definitions or their types
- No changes to onboarding context or navigation logic
- No new components — all changes are within `setup-guide-widget.tsx`

## Design Considerations

- Reference: Stripe's onboarding widget collapsed state — compact card with progress bar and next-step preview
- The `Maximize2` icon from lucide-react (already imported, confirmed available in `^0.468.0`) is used for the expand action
- All changes target `components/setup-guide-widget.tsx` only
- The custom shadow `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` is valid Tailwind arbitrary value syntax — no tailwind.config changes needed

## Technical Considerations

- All 3 stories modify only className values and collapsed-state JSX in `components/setup-guide-widget.tsx`
- Stories should be implemented in order (US-001 first, since US-002 references the collapsed mini-card's padding)
- Pre-existing typecheck errors exist in unrelated files (`stablecoin/page.tsx`, `dashboard-content.tsx`, `gated-action-button.tsx`, `onboarding-card.tsx`) — these are not regressions

## Success Metrics

- Collapsed widget matches Stripe reference: compact card, progress bar, next-step preview
- Expanded widget is visually denser with no wasted vertical space
- Both states have strong visual elevation above dashboard content
- No regressions in accordion behavior, step tracking, or dismiss logic

## Open Questions

- None — all three changes are well-defined className and JSX modifications
