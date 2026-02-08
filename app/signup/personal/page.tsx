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
import { BUSINESS_FUNCTIONS } from "@/lib/signup-data";

export default function SignupPersonalPage() {
  const router = useRouter();
  const {
    email,
    firstName,
    middleName,
    lastName,
    businessFunction,
    updateField,
  } = useSignupFlow();
  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localMiddleName, setLocalMiddleName] = useState(middleName);
  const [localLastName, setLocalLastName] = useState(lastName);
  const [localBusinessFunction, setLocalBusinessFunction] =
    useState(businessFunction);
  const [firstNameBlurred, setFirstNameBlurred] = useState(false);
  const [lastNameBlurred, setLastNameBlurred] = useState(false);
  const [businessFunctionBlurred, setBusinessFunctionBlurred] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const firstNameValid = localFirstName.trim().length >= 2;
  const lastNameValid = localLastName.trim().length >= 2;
  const businessFunctionValid = !!localBusinessFunction;
  const firstNameError =
    firstNameBlurred && !firstNameValid && localFirstName.trim().length > 0;
  const lastNameError =
    lastNameBlurred && !lastNameValid && localLastName.trim().length > 0;
  const businessFunctionError =
    businessFunctionBlurred && !businessFunctionValid;
  const formValid = firstNameValid && lastNameValid && businessFunctionValid;

  const handleNext = async () => {
    if (submittingRef.current || !formValid) return;
    submittingRef.current = true;
    setSubmitError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      updateField("firstName", localFirstName.trim());
      updateField("middleName", localMiddleName.trim());
      updateField("lastName", localLastName.trim());
      updateField("businessFunction", localBusinessFunction);
      router.push("/signup/success");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const handleBack = () => {
    router.push("/signup/business");
  };

  useEffect(() => {
    if (!email) router.replace("/signup/email");
  }, [email, router]);

  return (
    <>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Tell us about yourself
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            This helps us personalize your experience and set up your account
            access.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitError && (
            <InlineError
              error={submitError === "generic" ? "generic" : "unknown"}
            />
          )}
          <FieldGroup>
            <Field>
              <FieldLabel className="inline-flex items-center gap-1.5">
                First name
                {mounted && (
                  <InfoTooltip content="Enter your first name as it appears on official documents." />
                )}
              </FieldLabel>
              <Input
                type="text"
                placeholder="Jane"
                value={localFirstName}
                onChange={(e) => setLocalFirstName(e.target.value)}
                onBlur={() => setFirstNameBlurred(true)}
                aria-invalid={firstNameError ? true : undefined}
              />
              {firstNameError && (
                <FieldDescription className="text-destructive">
                  First name must be at least 2 characters
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel className="inline-flex items-center gap-1.5">
                Middle name
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                type="text"
                placeholder="Marie"
                value={localMiddleName}
                onChange={(e) => setLocalMiddleName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="inline-flex items-center gap-1.5">
                Last name
                {mounted && (
                  <InfoTooltip content="Enter your last name as it appears on official documents." />
                )}
              </FieldLabel>
              <Input
                type="text"
                placeholder="Smith"
                value={localLastName}
                onChange={(e) => setLocalLastName(e.target.value)}
                onBlur={() => setLastNameBlurred(true)}
                aria-invalid={lastNameError ? true : undefined}
              />
              {lastNameError && (
                <FieldDescription className="text-destructive">
                  Last name must be at least 2 characters
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel className="inline-flex items-center gap-1.5">
                Business function
                {mounted && (
                  <InfoTooltip content="Select your primary role or function within the business." />
                )}
              </FieldLabel>
              <Select
                value={localBusinessFunction || undefined}
                onValueChange={(v) => {
                  setLocalBusinessFunction(v ?? "");
                  setBusinessFunctionBlurred(true);
                }}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={businessFunctionError ? true : undefined}
                >
                  {localBusinessFunction ? (
                    BUSINESS_FUNCTIONS.find(
                      (f) => f.value === localBusinessFunction
                    )?.label ?? localBusinessFunction
                  ) : (
                    <SelectValue placeholder="Select function" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_FUNCTIONS.map((func) => (
                    <SelectItem key={func.value} value={func.value}>
                      {func.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {businessFunctionError && (
                <FieldDescription className="text-destructive">
                  Please select a business function
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              className="w-full"
              onClick={handleNext}
              disabled={!formValid}
              loading={loading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
