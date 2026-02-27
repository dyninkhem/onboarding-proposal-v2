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
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name*</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business function*</Label>
            <Select
              value={form.businessFunction}
              onValueChange={(v) => updateForm("businessFunction", v)}
            >
              <SelectTrigger className="w-full bg-white">
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
              <SelectTrigger className="w-full bg-white">
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
                <SelectTrigger className="w-full bg-white">
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
                className="bg-white"
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
