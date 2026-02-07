"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineError } from "@/components/signup/inline-error";
import { useSignupFlow } from "@/components/signup/signup-flow-context";
import { InfoTooltip } from "@/components/ui/tooltip";
import {
  COUNTRIES,
  getCountryFlagEmoji,
  UNSUPPORTED_COUNTRY_VALUE,
  USE_CASES,
} from "@/lib/signup-data";

export default function SignupBusinessPage() {
  const router = useRouter();
  const {
    email,
    fullName,
    businessName,
    dbaNames,
    country,
    useCase,
    updateField,
  } = useSignupFlow();
  const [localFullName, setLocalFullName] = useState(fullName);
  const [localBusinessName, setLocalBusinessName] = useState(businessName);
  const [localDbaNames, setLocalDbaNames] = useState(
    dbaNames.length > 0 ? dbaNames.join(", ") : ""
  );
  const [localCountry, setLocalCountry] = useState(country);
  const [localUseCase, setLocalUseCase] = useState(useCase);
  const [fullNameBlurred, setFullNameBlurred] = useState(false);
  const [businessNameBlurred, setBusinessNameBlurred] = useState(false);
  const [countryBlurred, setCountryBlurred] = useState(false);
  const [useCaseBlurred, setUseCaseBlurred] = useState(false);
  const [submitError, setSubmitError] = useState<"country_unsupported" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const submittingRef = useRef(false);
  useEffect(() => setMounted(true), []);

  const fullNameValid = localFullName.trim().length >= 2;
  const businessNameValid = localBusinessName.trim().length >= 2;
  const countryValid = !!localCountry;
  const useCaseValid = !!localUseCase;
  const fullNameError =
    fullNameBlurred && !fullNameValid && localFullName.trim().length > 0;
  const businessNameError =
    businessNameBlurred &&
    !businessNameValid &&
    localBusinessName.trim().length > 0;
  const countryError = countryBlurred && !countryValid;
  const useCaseError = useCaseBlurred && !useCaseValid;
  const formValid =
    fullNameValid && businessNameValid && countryValid && useCaseValid;

  const handleFinish = async () => {
    if (submittingRef.current || !formValid) return;
    submittingRef.current = true;
    setSubmitError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (localCountry === UNSUPPORTED_COUNTRY_VALUE) {
        setSubmitError("country_unsupported");
        return;
      }
      updateField("fullName", localFullName.trim());
      updateField("businessName", localBusinessName.trim());
      updateField(
        "dbaNames",
        localDbaNames.trim() ? localDbaNames.trim().split(/\s*,\s*/) : []
      );
      updateField("country", localCountry);
      updateField("useCase", localUseCase);
      router.push("/signup/success");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  useEffect(() => {
    if (!email) router.replace("/signup/email");
  }, [email, router]);

  if (!email) return null;

  return (
    <Card
      className="w-full"
      style={{
        animation: "step-completion-in 0.35s ease-out forwards",
      }}
    >
      <CardHeader>
        <CardTitle>Tell us about your business</CardTitle>
        <p className="text-muted-foreground text-sm">
          This helps us determine product access and prepare for business
          verification.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {submitError === "country_unsupported" && (
          <InlineError
            title="Country not supported"
            message="Paxos services are not currently available in your selected country"
            helper="Regulations vary by region. Contact us if you believe this is an error"
            actions={
              <a
                href="https://paxos.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline underline-offset-4 hover:no-underline"
              >
                Contact support
              </a>
            }
          />
        )}
        <FieldGroup>
          <Field>
            <FieldLabel className="inline-flex items-center gap-1.5">
              Full name
              {mounted && (
                <InfoTooltip content="Enter your name exactly as it appears on official documents. This will be associated with your Paxos account." />
              )}
            </FieldLabel>
            <Input
              type="text"
              placeholder="Jane Smith"
              value={localFullName}
              onChange={(e) => setLocalFullName(e.target.value)}
              onBlur={() => setFullNameBlurred(true)}
              aria-invalid={fullNameError ? true : undefined}
            />
            {fullNameError && (
              <FieldDescription className="text-destructive">
                Name must be at least 2 characters
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="inline-flex items-center gap-1.5">
              Business legal name
              {mounted && (
                <InfoTooltip content="Enter your company's official registered name exactly as it appears on incorporation documents and government filings." />
              )}
            </FieldLabel>
            <Input
              type="text"
              placeholder="Acme Inc."
              value={localBusinessName}
              onChange={(e) => setLocalBusinessName(e.target.value)}
              onBlur={() => setBusinessNameBlurred(true)}
              aria-invalid={businessNameError ? true : undefined}
            />
            {businessNameError && (
              <FieldDescription className="text-destructive">
                Name must be at least 2 characters
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel>DBA / trade names (optional)</FieldLabel>
            <Input
              type="text"
              placeholder="e.g. Acme Trading, Acme Holdings"
              value={localDbaNames}
              onChange={(e) => setLocalDbaNames(e.target.value)}
              aria-describedby="dba-description"
            />
            <FieldDescription id="dba-description">
              Comma-separated if you have multiple
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel className="inline-flex items-center gap-1.5">
              Country of incorporation
              {mounted && (
                <InfoTooltip content="Select the country or region where your business is incorporated. If you're an individual, select where you're doing business from." />
              )}
            </FieldLabel>
            <Select
              value={localCountry || undefined}
              onValueChange={(v) => {
                setLocalCountry(v ?? "");
                setCountryBlurred(true);
              }}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={countryError ? true : undefined}
              >
                {localCountry ? (
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none" aria-hidden>
                      {getCountryFlagEmoji(localCountry)}
                    </span>
                    {COUNTRIES.find((c) => c.value === localCountry)?.label ??
                      localCountry}
                  </span>
                ) : (
                  <SelectValue placeholder="Select country" />
                )}
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none" aria-hidden>
                        {getCountryFlagEmoji(c.value)}
                      </span>
                      {c.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {countryError && (
              <FieldDescription className="text-destructive">
                Please select a country
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel className="inline-flex items-center gap-1.5">
              Primary use case
              {mounted && (
                <InfoTooltip content="Select your primary use case. This helps us configure the right products and limits for your business. You can access additional products after signup." />
              )}
            </FieldLabel>
            <Select
              value={localUseCase || undefined}
              onValueChange={(v) => {
                setLocalUseCase(v ?? "");
                setUseCaseBlurred(true);
              }}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={useCaseError ? true : undefined}
              >
                {localUseCase ? (
                  USE_CASES.find((uc) => uc.value === localUseCase)?.label ??
                  localUseCase
                ) : (
                  <SelectValue placeholder="Select use case" />
                )}
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    <span className="font-medium">{uc.label}</span>
                    <span className="text-muted-foreground block text-xs">
                      {uc.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {useCaseError && (
              <FieldDescription className="text-destructive">
                Please select a use case
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleFinish}
            disabled={!formValid}
            loading={loading}
          >
            Finish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
