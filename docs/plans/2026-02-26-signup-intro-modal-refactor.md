# Signup Flow & Intro Modal Refactor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify the signup flow to 3 fields, add an auto-advancing success page, and build a Stripe-style intro modal on the dashboard that collects business details and offering preferences.

**Architecture:** Standalone intro modal component with its own step state, backed by a static offerings data module (`lib/intro-data.ts`). Modal writes to localStorage on completion; OnboardingContext reads from it. Signup is consolidated from 7 pages to 1 page + auto-redirect success.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, shadcn/ui (Dialog, Select, Checkbox, Tooltip), Tailwind CSS 4, localStorage for state persistence.

**Verification:** No test framework — verify via `pnpm build` (type checking) and `pnpm dev` (visual in browser).

---

## Task 1: Create offerings data module

**Files:**
- Create: `lib/intro-data.ts`

**Step 1: Create the offerings catalog and types**

Create `lib/intro-data.ts` with the following content:

```ts
export type EntityType = "PTC" | "PTE" | "PME"

export type GeographyFilter = "all" | "us-only" | "non-us-only"

export interface Offering {
  id: string
  label: string
  description: string
  geographyFilter: GeographyFilter
  entityType: EntityType
  category: string
}

export const OFFERINGS: Offering[] = [
  {
    id: "stablecoin-access",
    label: "Access & distribute stablecoins (PYUSD, USDP, USDG)",
    description:
      "Access and distribute stablecoins at scale including PYUSD, USDP, USDG, and other stablecoins.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
  {
    id: "stablecoin-yield",
    label: "Earn yield on stablecoins (USDL)",
    description:
      "Earn yield on stablecoins through USDL, a yield-bearing stablecoin for non-US entities.",
    geographyFilter: "non-us-only",
    entityType: "PME",
    category: "Stablecoin Solutions",
  },
  {
    id: "custody",
    label: "Digital asset custody",
    description:
      "Create wallets and manage custody of digital assets for your business with institutional-grade security.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Custody",
  },
  {
    id: "trading",
    label: "Crypto trading (buy, sell, trade)",
    description:
      "Enable customers to buy, sell, and trade digital assets with deep liquidity and competitive pricing.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Trading",
  },
  {
    id: "payments",
    label: "Payments & remittance",
    description:
      "Build payment or remittance solutions using stablecoins for fast, low-cost global transfers.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Payments Solutions",
  },
  {
    id: "branded-stablecoin",
    label: "Launch a branded stablecoin",
    description:
      "Launch your own branded stablecoin backed by Paxos infrastructure and regulatory framework.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
  {
    id: "tokenized-gold",
    label: "Tokenized gold (PAXG)",
    description:
      "Access tokenized gold (PAXG) — each token is backed by one fine troy ounce of London Good Delivery gold.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
  {
    id: "gdn-partner",
    label: "Global Dollar Network partner",
    description:
      "Become a partner of the Global Dollar Network to access USDG distribution and ecosystem benefits.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
]

export interface IntroData {
  firstName: string
  lastName: string
  businessFunction: string
  countryOfIncorporation: string
  incorporationIdType: string
  incorporationId: string
  entityType: "PTC" | "PTE"
  hasUSDL: boolean
  selectedOfferings: string[]
  completedAt: string
}

const INTRO_COMPLETE_KEY = "intro-complete"
const INTRO_DATA_KEY = "intro-data"

export function isUS(country: string): boolean {
  return country === "US"
}

export function inferEntityType(country: string): "PTC" | "PTE" {
  return isUS(country) ? "PTC" : "PTE"
}

export function getOfferingsForCountry(country: string): Offering[] {
  const us = isUS(country)
  return OFFERINGS.filter((o) => {
    if (o.geographyFilter === "all") return true
    if (o.geographyFilter === "us-only") return us
    if (o.geographyFilter === "non-us-only") return !us
    return true
  })
}

export function getRecommendedOfferingIds(country: string): string[] {
  if (isUS(country)) {
    return ["stablecoin-access", "custody"]
  }
  return ["stablecoin-access", "stablecoin-yield"]
}

export function getIntroComplete(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(INTRO_COMPLETE_KEY) === "true"
}

export function getIntroData(): IntroData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(INTRO_DATA_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveIntroData(data: IntroData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(INTRO_COMPLETE_KEY, "true")
  localStorage.setItem(INTRO_DATA_KEY, JSON.stringify(data))
}

export function saveIntroSkipped(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(INTRO_COMPLETE_KEY, "false")
}

export function clearIntroData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(INTRO_COMPLETE_KEY)
  localStorage.removeItem(INTRO_DATA_KEY)
}
```

**Step 2: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds with no type errors in `lib/intro-data.ts`

**Step 3: Commit**

```bash
git add lib/intro-data.ts
git commit -m "feat: add offerings data module with geography and entity logic"
```

---

## Task 2: Simplify SignupFlowContext

**Files:**
- Modify: `components/signup/signup-flow-context.tsx`

**Step 1: Reduce state to 3 fields**

Replace the entire `SignupFlowState` type and `initialState` (lines 12-46) with:

```ts
type SignupFlowState = {
  email: string;
  password: string;
  companyName: string;
};

const initialState: SignupFlowState = {
  email: "",
  password: "",
  companyName: "",
};
```

The rest of the file (context provider, `updateField`, `clearState`, `loadState`, `saveState`) remains unchanged — it's generic over `SignupFlowState` keys.

**Step 2: Verify types compile**

Run: `pnpm build`
Expected: Type errors in files that reference removed fields (business page, personal page, success page, etc.). This is expected — we'll fix those in subsequent tasks.

**Step 3: Commit**

```bash
git add components/signup/signup-flow-context.tsx
git commit -m "refactor: reduce SignupFlowContext to email, password, companyName"
```

---

## Task 3: Consolidate signup page

**Files:**
- Modify: `app/signup/page.tsx` (replace redirect with full signup form)
- Delete: `app/signup/email/page.tsx`
- Delete: `app/signup/verify/page.tsx`
- Delete: `app/signup/passkey/page.tsx`
- Delete: `app/signup/business/page.tsx`
- Delete: `app/signup/personal/page.tsx`
- Delete: `app/signup/terms/page.tsx`

**Step 1: Replace signup page with consolidated form**

Replace `app/signup/page.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignupFlow } from "@/components/signup/signup-flow-context";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function SignupPage() {
  const router = useRouter();
  const { updateField } = useSignupFlow();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const submittingRef = useRef(false);

  const emailValid = email.trim().length > 0 && isValidEmail(email);
  const emailError =
    emailBlurred && !emailValid && email.trim().length > 0
      ? "Please enter a valid email address."
      : null;

  const formValid =
    emailValid && password.trim().length >= 1 && companyName.trim().length >= 1;

  const handleSubmit = async () => {
    if (submittingRef.current || !formValid) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      updateField("email", email.trim());
      updateField("password", password);
      updateField("companyName", companyName.trim());
      router.push("/signup/success");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign Up Your Business</CardTitle>
        <p className="text-muted-foreground text-sm">
          Create a Paxos account to get started.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailBlurred(true)}
              aria-invalid={emailError ? true : undefined}
            />
            {emailError && (
              <FieldDescription className="text-destructive">
                {emailError}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Company name</FieldLabel>
            <Input
              type="text"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!formValid}
            loading={loading}
          >
            Create Account
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
```

**Step 2: Delete old signup sub-pages**

Delete these files/directories:
- `app/signup/email/page.tsx`
- `app/signup/verify/page.tsx`
- `app/signup/passkey/page.tsx`
- `app/signup/business/page.tsx`
- `app/signup/personal/page.tsx`
- `app/signup/terms/page.tsx`

Also delete the passkey modal component if it exists: `components/signup/passkey-modal.tsx`

**Step 3: Verify**

Run: `pnpm build`
Expected: Builds successfully. Navigate to `/signup` in browser — should show 3-field form.

**Step 4: Commit**

```bash
git add -A app/signup/ components/signup/
git commit -m "feat: consolidate signup to single page with email, password, company name"
```

---

## Task 4: Auto-advancing success page

**Files:**
- Modify: `app/signup/success/page.tsx`

**Step 1: Replace success page with auto-redirect animation**

Replace `app/signup/success/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { useSignupFlow } from "@/components/signup/signup-flow-context";

export default function SignupSuccessPage() {
  const router = useRouter();
  const { companyName, clearState } = useSignupFlow();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const showTimer = setTimeout(() => setShow(true), 50);
    // Clear signup state and redirect after 2 seconds
    const redirectTimer = setTimeout(() => {
      clearState();
      router.push("/dashboard");
    }, 2000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(redirectTimer);
    };
  }, [clearState, router]);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center transition-all duration-500 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2Icon className="text-primary size-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Account created</h1>
        <p className="text-sm text-white/70">
          Welcome to Paxos{companyName ? `, ${companyName}` : ""}. Taking you to
          your dashboard...
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Run: `pnpm build`
Expected: Builds successfully. In browser: signup → success page shows animation → auto-redirects to `/dashboard` after 2 seconds.

**Step 3: Commit**

```bash
git add app/signup/success/page.tsx
git commit -m "feat: replace success page with auto-advancing animation redirect"
```

---

## Task 5: Build intro modal shell

**Files:**
- Create: `components/intro-modal/intro-modal.tsx`

**Step 1: Create the main modal component**

Create `components/intro-modal/intro-modal.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { getIntroComplete, saveIntroData, saveIntroSkipped } from "@/lib/intro-data";
import type { IntroData } from "@/lib/intro-data";
import { inferEntityType } from "@/lib/intro-data";
import { StepBusiness } from "./step-business";
import { StepRecommendations } from "./step-recommendations";
import { StepOfferings } from "./step-offerings";
import { StepConfirmation } from "./step-confirmation";

export interface IntroFormState {
  firstName: string;
  lastName: string;
  businessFunction: string;
  countryOfIncorporation: string;
  incorporationIdType: string;
  incorporationId: string;
  recommendedOfferings: string[];
  selectedOfferings: string[];
}

const initialFormState: IntroFormState = {
  firstName: "",
  lastName: "",
  businessFunction: "",
  countryOfIncorporation: "",
  incorporationIdType: "",
  incorporationId: "",
  recommendedOfferings: [],
  selectedOfferings: [],
};

export function IntroModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<IntroFormState>(initialFormState);

  useEffect(() => {
    // Show modal if intro hasn't been completed
    if (!getIntroComplete()) {
      setOpen(true);
    }
  }, []);

  const updateForm = useCallback(
    <K extends keyof IntroFormState>(field: K, value: IntroFormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSkip = useCallback(() => {
    saveIntroSkipped();
    setOpen(false);
  }, []);

  const handleComplete = useCallback(() => {
    const entityType = inferEntityType(form.countryOfIncorporation);
    const data: IntroData = {
      firstName: form.firstName,
      lastName: form.lastName,
      businessFunction: form.businessFunction,
      countryOfIncorporation: form.countryOfIncorporation,
      incorporationIdType: form.incorporationIdType,
      incorporationId: form.incorporationId,
      entityType,
      hasUSDL: form.selectedOfferings.includes("stablecoin-yield"),
      selectedOfferings: form.selectedOfferings,
      completedAt: new Date().toISOString(),
    };
    saveIntroData(data);
    setOpen(false);
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleSkip();
    }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl rounded-xl border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] min-h-[560px]">
            {/* Left panel: form content */}
            <div className="flex flex-col p-8 overflow-y-auto">
              {step === 1 && (
                <StepBusiness
                  form={form}
                  updateForm={updateForm}
                  onContinue={() => setStep(2)}
                  onSkip={handleSkip}
                />
              )}
              {step === 2 && (
                <StepRecommendations
                  form={form}
                  updateForm={updateForm}
                  onContinue={() => setStep(3)}
                  onBack={() => setStep(1)}
                  onSkip={handleSkip}
                />
              )}
              {step === 3 && (
                <StepOfferings
                  form={form}
                  updateForm={updateForm}
                  onContinue={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <StepConfirmation
                  onComplete={handleComplete}
                  onBack={() => setStep(3)}
                />
              )}
            </div>

            {/* Right panel: branded illustration */}
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 p-8">
              <div className="w-full max-w-[280px] rounded-xl bg-white/80 backdrop-blur-sm shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500 text-white text-xs font-bold">
                    P
                  </div>
                  <span className="font-semibold text-gray-900">
                    {form.companyName || "Your Company"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  paxos.com
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-3/4 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
```

Note: The right panel reads `form.companyName` — but that field doesn't exist in our IntroFormState. Since the design calls for a static branded illustration, we should either hardcode the company name or remove it. The design says static, so replace `{form.companyName || "Your Company"}` with just `{"paxos"}` and `paxos.com` stays. Actually — let me keep it simple. We'll read the company name from signup data in localStorage if available, or just show "paxos" as the brand. For the prototype, hardcode "paxos".

**Step 2: Verify file compiles (it won't yet — step components don't exist)**

This step will be verified after Task 6-9 are complete.

**Step 3: Commit**

```bash
git add components/intro-modal/intro-modal.tsx
git commit -m "feat: add intro modal shell with two-column layout"
```

---

## Task 6: Build Step 1 — Business Details

**Files:**
- Create: `components/intro-modal/step-business.tsx`

**Step 1: Create the business details step**

Create `components/intro-modal/step-business.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IntroFormState } from "./intro-modal";

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "SG", label: "Singapore" },
  { value: "DE", label: "Germany" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "HK", label: "Hong Kong" },
  { value: "CH", label: "Switzerland" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "FR", label: "France" },
  { value: "KR", label: "South Korea" },
  { value: "IN", label: "India" },
  { value: "MX", label: "Mexico" },
];

const BUSINESS_FUNCTIONS = [
  "Engineering",
  "Product",
  "Finance",
  "Operations",
  "Legal & Compliance",
  "Executive / C-Suite",
  "Business Development",
  "Other",
];

const INCORPORATION_ID_TYPES = [
  { value: "ein", label: "EIN (US)" },
  { value: "crn", label: "Company Registration Number" },
  { value: "uen", label: "UEN (Singapore)" },
  { value: "abn", label: "ABN (Australia)" },
  { value: "other", label: "Other" },
];

interface StepBusinessProps {
  form: IntroFormState;
  updateForm: <K extends keyof IntroFormState>(
    field: K,
    value: IntroFormState[K]
  ) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function StepBusiness({
  form,
  updateForm,
  onContinue,
  onSkip,
}: StepBusinessProps) {
  const canContinue =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.businessFunction.length > 0 &&
    form.countryOfIncorporation.length > 0 &&
    form.incorporationIdType.length > 0 &&
    form.incorporationId.trim().length > 0;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome to Paxos
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Answer a few questions about your business to customize your setup.
          You can always change this later.
        </p>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name*</Label>
              <Input
                id="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name*</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business function*</Label>
            <Select
              value={form.businessFunction}
              onValueChange={(v) => updateForm("businessFunction", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_FUNCTIONS.map((fn) => (
                  <SelectItem key={fn} value={fn}>
                    {fn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Country of incorporation*</Label>
            <Select
              value={form.countryOfIncorporation}
              onValueChange={(v) => updateForm("countryOfIncorporation", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Incorporation ID type*</Label>
              <Select
                value={form.incorporationIdType}
                onValueChange={(v) => updateForm("incorporationIdType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INCORPORATION_ID_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incorporationId">Incorporation ID*</Label>
              <Input
                id="incorporationId"
                placeholder="Enter ID"
                value={form.incorporationId}
                onChange={(e) => updateForm("incorporationId", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-auto">
        <button
          type="button"
          onClick={onSkip}
          className="text-primary text-sm font-medium hover:underline underline-offset-4"
        >
          Skip for now
        </button>
        <Button onClick={onContinue} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/intro-modal/step-business.tsx
git commit -m "feat: add Step 1 business details form for intro modal"
```

---

## Task 7: Build Step 2 — Recommendations

**Files:**
- Create: `components/intro-modal/step-recommendations.tsx`

**Step 1: Create the recommendations step**

Create `components/intro-modal/step-recommendations.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getOfferingsForCountry,
  getRecommendedOfferingIds,
} from "@/lib/intro-data";
import type { IntroFormState } from "./intro-modal";

interface StepRecommendationsProps {
  form: IntroFormState;
  updateForm: <K extends keyof IntroFormState>(
    field: K,
    value: IntroFormState[K]
  ) => void;
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepRecommendations({
  form,
  updateForm,
  onContinue,
  onBack,
  onSkip,
}: StepRecommendationsProps) {
  const country = form.countryOfIncorporation;
  const offerings = getOfferingsForCountry(country);
  const recommendedIds = getRecommendedOfferingIds(country);
  const recommended = offerings.filter((o) => recommendedIds.includes(o.id));

  // Pre-select recommended offerings when entering this step
  useEffect(() => {
    if (form.recommendedOfferings.length === 0) {
      updateForm("recommendedOfferings", recommendedIds);
      updateForm("selectedOfferings", recommendedIds);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOffering = (id: string) => {
    const current = form.recommendedOfferings;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    updateForm("recommendedOfferings", next);
    updateForm("selectedOfferings", next);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        <button
          type="button"
          onClick={onBack}
          className="text-primary text-sm font-medium hover:underline underline-offset-4 inline-flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>

        <h2 className="text-2xl font-semibold tracking-tight">
          Recommendations for you
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Based on your business details, these options will work best for your
          business.
        </p>

        <div className="mt-6 space-y-3">
          {recommended.map((offering) => {
            const checked = form.recommendedOfferings.includes(offering.id);
            return (
              <label
                key={offering.id}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleOffering(offering.id)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">{offering.label}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {offering.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-auto">
        <button
          type="button"
          onClick={onSkip}
          className="text-primary text-sm font-medium hover:underline underline-offset-4"
        >
          Skip for now
        </button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/intro-modal/step-recommendations.tsx
git commit -m "feat: add Step 2 recommendations with pre-selected checkbox cards"
```

---

## Task 8: Build Step 3 — All Offerings

**Files:**
- Create: `components/intro-modal/step-offerings.tsx`

**Step 1: Create the offerings selection step**

Create `components/intro-modal/step-offerings.tsx`:

```tsx
"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOfferingsForCountry } from "@/lib/intro-data";
import type { IntroFormState } from "./intro-modal";

interface StepOfferingsProps {
  form: IntroFormState;
  updateForm: <K extends keyof IntroFormState>(
    field: K,
    value: IntroFormState[K]
  ) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StepOfferings({
  form,
  updateForm,
  onContinue,
  onBack,
}: StepOfferingsProps) {
  const offerings = getOfferingsForCountry(form.countryOfIncorporation);

  const toggleOffering = (id: string) => {
    const current = form.selectedOfferings;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    updateForm("selectedOfferings", next);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        <button
          type="button"
          onClick={onBack}
          className="text-primary text-sm font-medium hover:underline underline-offset-4 inline-flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>

        <h2 className="text-2xl font-semibold tracking-tight">
          Are there other ways you want to use Paxos?
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          This step is optional. You can always change this later.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {offerings.map((offering) => {
            const selected = form.selectedOfferings.includes(offering.id);
            return (
              <Tooltip key={offering.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toggleOffering(offering.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {offering.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[280px] text-xs"
                >
                  {offering.description}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <Button className="w-full" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/intro-modal/step-offerings.tsx
git commit -m "feat: add Step 3 offerings selection with chip buttons and tooltips"
```

---

## Task 9: Build Step 4 — Confirmation

**Files:**
- Create: `components/intro-modal/step-confirmation.tsx`

**Step 1: Create the confirmation step**

Create `components/intro-modal/step-confirmation.tsx`:

```tsx
"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepConfirmationProps {
  onComplete: () => void;
  onBack: () => void;
}

const NEXT_STEPS = [
  {
    number: 1,
    title: "Complete your setup",
    description:
      "Follow the steps in your setup guide to explore features that fit your business needs.",
  },
  {
    number: 2,
    title: "Submit for review",
    description:
      "When you're ready, submit your application for compliance review.",
  },
  {
    number: 3,
    title: "You're ready to go",
    description:
      "Once approved, start using Paxos services with your selected offerings.",
  },
];

export function StepConfirmation({ onComplete, onBack }: StepConfirmationProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        <button
          type="button"
          onClick={onBack}
          className="text-primary text-sm font-medium hover:underline underline-offset-4 inline-flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>

        <h2 className="text-2xl font-semibold tracking-tight">
          Get started with your account
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Your account is ready. Here&apos;s what comes next.
        </p>

        <div className="mt-8 relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-[24px] bottom-[24px] w-0.5 bg-primary/20" />

          <div className="space-y-8">
            {NEXT_STEPS.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold relative z-10">
                  {step.number}
                </div>
                <div className="pt-0.5">
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <Button className="w-full" onClick={onComplete}>
          Get started
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/intro-modal/step-confirmation.tsx
git commit -m "feat: add Step 4 confirmation with next-steps timeline"
```

---

## Task 10: Mount intro modal on dashboard + add re-entry CTA

**Files:**
- Modify: `app/dashboard/layout.tsx` (line 18 — add IntroModal)
- Modify: `components/dashboard-content.tsx` (add re-entry banner)

**Step 1: Add IntroModal to dashboard layout**

In `app/dashboard/layout.tsx`, add the import and mount the modal after `SetupGuideWidget`:

Add import at top:
```ts
import { IntroModal } from "@/components/intro-modal/intro-modal"
```

Add `<IntroModal />` after `<SetupGuideWidget />` (inside the `OnboardingProvider`):

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <SetupGuideWidget />
      <IntroModal />
    </OnboardingProvider>
  )
}
```

**Step 2: Add re-entry banner to dashboard content**

In `components/dashboard-content.tsx`, add a banner that shows when `intro-complete` is `"false"` (skipped) — insert it right after the `<OnboardingCard />` line (around line 556):

Add imports at top of file:
```ts
import { getIntroComplete, clearIntroData } from "@/lib/intro-data"
```

Add state for showing the modal re-entry:
```ts
const [showIntroPrompt, setShowIntroPrompt] = useState(false)
const [introModalOpen, setIntroModalOpen] = useState(false)

useEffect(() => {
  // Show re-entry prompt if intro was skipped (not completed)
  const complete = getIntroComplete()
  if (!complete) {
    setShowIntroPrompt(true)
  }
}, [])
```

After `<OnboardingCard />`, add:
```tsx
{showIntroPrompt && (
  <Card className="border-primary/20 bg-primary/5 py-3">
    <CardContent className="flex items-center justify-between px-4">
      <div>
        <p className="text-sm font-medium">Customize your setup</p>
        <p className="text-muted-foreground text-xs">
          Tell us about your business to get personalized recommendations.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          clearIntroData()
          window.location.reload()
        }}
      >
        Get started
      </Button>
    </CardContent>
  </Card>
)}
```

Note: The re-entry uses `clearIntroData()` + page reload to re-trigger the modal (since `IntroModal` checks `getIntroComplete()` on mount). This is a pragmatic approach for the prototype.

**Step 3: Verify the full flow**

Run: `pnpm build`
Expected: Builds with no errors.

Run: `pnpm dev`
Expected:
1. Navigate to `/signup` → see 3-field form
2. Submit → success animation → auto-redirect to `/dashboard`
3. Dashboard shows intro modal automatically
4. Step through all 4 modal steps or close/skip
5. After skip, dashboard shows "Customize your setup" re-entry banner
6. Clicking "Get started" re-opens the modal

**Step 4: Commit**

```bash
git add app/dashboard/layout.tsx components/dashboard-content.tsx
git commit -m "feat: mount intro modal on dashboard with re-entry banner"
```

---

## Task 11: Cleanup and final verification

**Files:**
- Remove: any remaining references to deleted signup pages
- Verify: `pnpm build` passes cleanly

**Step 1: Check for stale imports**

Search the codebase for any remaining imports of:
- `passkey-modal`
- References to `/signup/verify`, `/signup/passkey`, `/signup/business`, `/signup/personal`, `/signup/terms`
- References to removed `SignupFlowState` fields (`fullName`, `code`, `dbaNames`, `country`, `useCase`, etc.)

Fix any broken references.

**Step 2: Clean build**

Run: `pnpm build`
Expected: Build succeeds with zero errors.

**Step 3: Visual verification**

Run: `pnpm dev`
Verify the complete flow:
1. `/signup` shows email + password + company name
2. Submit → success animation → `/dashboard` redirect
3. Intro modal appears on dashboard
4. Step 1: fill business details → Continue
5. Step 2: recommended offerings pre-selected → Continue
6. Step 3: all offerings as chips with tooltips → Continue
7. Step 4: timeline confirmation → "Get started" closes modal
8. Setup guide widget still works normally
9. Closing modal → re-entry banner appears

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: cleanup stale references from signup refactor"
```

---

## Task 12: Browser agent testing — walk all flows and find issues

**Prerequisites:** Tasks 1-11 complete, `pnpm build` passes, dev server running.

**Tools:** Use `agent-browser` (browser automation agent) to navigate the app as a real user would. Start the dev server with `pnpm dev` on port 3000 before running tests.

**Step 1: Start the dev server**

Run: `pnpm dev`
Confirm: Server is running at `http://localhost:3000`

**Step 2: Test Flow A — Signup happy path**

Navigate to `http://localhost:3000/signup`. Test the following:

1. **Empty form validation:** Click "Create Account" with all fields empty → button should be disabled
2. **Email validation:** Enter `notanemail`, tab out → should show validation error. Enter `valid@example.com` → error clears
3. **Partial form:** Fill email + password but leave company name empty → button stays disabled
4. **Full form submit:** Fill email=`test@example.com`, password=`Test1234`, company=`Acme Corp` → click "Create Account"
5. **Success page:** Verify animation appears (checkmark + "Account created" text + company name)
6. **Auto-redirect:** Confirm auto-redirect to `/dashboard` within ~2 seconds (no manual click required)
7. **Sign in link:** Go back to `/signup` → click "Sign in" link → verify it navigates to `/login`

**Step 3: Test Flow B — Intro modal appears on dashboard**

After redirect from signup success, or navigate directly to `http://localhost:3000/dashboard`:

1. **Modal auto-opens:** Verify the intro modal appears automatically on first visit
2. **Layout:** Confirm two-column layout — left panel with form, right panel with branded gradient/card
3. **Close button:** Verify X button is in top-right corner and is clickable
4. **Overlay:** Verify backdrop dimming behind modal
5. **Escape key:** Press Escape → modal should close
6. **Overlay click:** Re-open modal, click outside the modal card → should close

**Step 4: Test Flow C — Intro modal Step 1 (Business Details)**

1. **Heading:** "Welcome to Paxos" with subtext visible
2. **Fields present:** First name, Last name, Business function (dropdown), Country of incorporation (dropdown), Incorporation ID type (dropdown), Incorporation ID (text)
3. **Required validation:** Leave all fields empty → "Continue" button disabled
4. **Fill partially:** Fill first name + last name only → button still disabled
5. **Select dropdowns:** Click Business function → verify dropdown opens with options. Select "Engineering". Repeat for Country ("United States") and Incorporation ID type ("EIN (US)")
6. **Fill completely:** Fill all 6 fields → "Continue" button becomes enabled
7. **Skip for now:** Verify "Skip for now" link is visible and clickable → closes modal
8. **Continue:** Click Continue → should advance to Step 2

**Step 5: Test Flow D — Intro modal Step 2 (Recommendations)**

1. **Back link:** Verify "← Back" link goes back to Step 1 with data preserved
2. **Navigate forward again** to Step 2
3. **Heading:** "Recommendations for you"
4. **Pre-selected cards:** For US country selection, verify "Access & distribute stablecoins" and "Digital asset custody" appear as checkbox cards, both pre-checked
5. **Uncheck:** Click a card to uncheck → checkbox deselects, card border changes
6. **Re-check:** Click again → card re-selects
7. **Skip for now:** Verify link is visible
8. **Continue:** Click Continue → advance to Step 3

**Step 6: Test Flow E — Intro modal Step 3 (All Offerings)**

1. **Back link:** Verify "← Back" goes to Step 2
2. **Navigate forward again** to Step 3
3. **Heading:** "Are there other ways you want to use Paxos?"
4. **Chip count:** For US user, verify 7 chips visible (USDL hidden). For non-US user, verify 8 chips
5. **Pre-selected chips:** Chips selected in Step 2 should carry over as selected (filled style with checkmark)
6. **Toggle chip:** Click an unselected chip → becomes selected (primary color + checkmark). Click again → deselects
7. **Tooltips:** Hover over any chip → tooltip appears with full description text
8. **Continue:** Click full-width "Continue" button → advance to Step 4

**Step 7: Test Flow F — Intro modal Step 4 (Confirmation)**

1. **Back link:** Verify "← Back" goes to Step 3
2. **Heading:** "Get started with your account"
3. **Timeline:** Verify 3 numbered steps with vertical connecting line:
   - "1. Complete your setup"
   - "2. Submit for review"
   - "3. You're ready to go"
4. **Get started button:** Full-width "Get started" button visible
5. **Click "Get started":** Modal closes, user lands on dashboard. Verify `localStorage` has `intro-complete` = `"true"` and `intro-data` contains all submitted data
6. **Modal stays closed:** Refresh the page → modal should NOT re-appear

**Step 8: Test Flow G — Skip and re-entry**

1. **Clear state:** Clear localStorage (`localStorage.clear()`) and reload `/dashboard`
2. **Modal appears:** Verify modal opens
3. **Skip immediately:** Click "Skip for now" on Step 1 (or close via X button)
4. **Re-entry banner:** Verify a "Customize your setup" banner/card appears on the dashboard with a "Get started" button
5. **Re-open modal:** Click "Get started" on the banner → modal re-opens at Step 1
6. **Complete modal:** Walk through all 4 steps and click "Get started" on Step 4
7. **Banner gone:** Verify re-entry banner no longer shows after completion

**Step 9: Test Flow H — Non-US geography path**

1. **Clear state:** Clear localStorage and reload `/dashboard`
2. **Step 1:** Select country = "Singapore" (non-US)
3. **Step 2:** Verify recommendations include "Access & distribute stablecoins" and "Earn yield on stablecoins (USDL)" — both pre-selected
4. **Step 3:** Verify USDL chip IS visible (8 total chips instead of 7)
5. **Step 4 → Complete:** Verify `intro-data` in localStorage has `entityType: "PTE"` and `hasUSDL: true` (if USDL was selected)

**Step 10: Test Flow I — Edge cases and regressions**

1. **Direct URL access:** Navigate directly to `http://localhost:3000/signup/success` without going through signup → should still render (may show generic text)
2. **Dashboard without modal:** Set `localStorage.setItem("intro-complete", "true")` manually, reload `/dashboard` → modal should NOT appear, no re-entry banner
3. **Setup guide widget:** Verify the existing setup guide widget still renders correctly in the bottom-right of the dashboard
4. **Responsive:** Resize browser to mobile width (<768px) → verify signup form still usable, modal right panel should be hidden (md:flex)
5. **Browser refresh mid-modal:** Open modal, fill Step 1, refresh page → modal re-opens (data may be lost — this is acceptable for prototype)
6. **Console errors:** Check browser console for React errors, hydration mismatches, or unhandled exceptions throughout all flows

**Step 11: Document issues**

Create a file `docs/plans/2026-02-26-browser-test-results.md` with:
- Each flow tested (A through I)
- Pass/fail status for each check
- Screenshots or descriptions of any issues found
- Severity classification: P0 (broken flow), P1 (visual bug), P2 (minor polish)

**Step 12: Fix P0 issues**

Address any P0 (broken flow) issues immediately. P1/P2 issues can be tracked for follow-up.

**Step 13: Commit fixes**

```bash
git add -A
git commit -m "fix: address issues found in browser agent testing"
```
